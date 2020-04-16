import requests
import time
import csv
import codecs
import json
import boto3
from datetime import datetime
from typing import List, Dict

s3_client = boto3.client("s3")
covid_data_bucket = 'aristotle-ecdc-covid19-data'
csv_url = "https://aristotle-ecdc-covid19-data.s3-ap-southeast-2.amazonaws.com/covid_spreadsheet.csv"


class DataTransformer:
    """A transformer that removes unwanted fields and adds in useful extra metadata from daily EDCC COVID-19
    case data """
    edcc_url = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/'

    def __init__(self):
        self.raw_data = self.request_edcc_data()
        self.extra_metadata = self.load_data_from_csv()

    def request_edcc_data(self):
        request = requests.get(self.edcc_url)
        return request.json()

    def remove_unwanted_fields(self, record) -> Dict:
        """Remove unwanted fields from data"""
        unwanted_fields = ['GeoId', 'popData2018']
        for field in unwanted_fields:
            if field in record:
                del record[field]

        return record

    def load_data_from_csv(self) -> List[Dict]:
        """Load the CSV file containing additional metadata and convert to dictionary"""
        response = requests.get(csv_url)

        csv_dict = csv.DictReader(codecs.iterdecode(response.iter_lines(), 'utf-8'))
        extra_metadata = {}
        for row in csv_dict:
            country_code = row.pop('countryCode')
            row = {country_code: {k.strip(): v.strip() for k, v in row.items()}}

            extra_metadata.update(row)

        return extra_metadata

    def add_cumulative_totals(self, data) -> List[Dict]:
        """Calculate a running cumulative total and attach to records"""
        data = data['records']
        # Sort by date
        data.sort(key=lambda x: time.mktime(time.strptime(x['dateRep'],"%d/%m/%Y")))
        # Sort by country code
        data.sort(key=lambda x: x['geoId'])

        previous_region = data[0]['geoId']

        cumulative_cases = 0
        cumulative_deaths = 0
        cases_last_7_days = 0
        days_since_last_case = 0

        index = 0
        for record in data:
            if record['geoId'] != previous_region:
                # We're on to a new country, reset the cumulative total count
                cumulative_cases = cumulative_deaths = cases_last_7_days = days_since_last_case = 0

            daily_cases = int(record['cases'])
            daily_deaths = int(record['cases'])

            cumulative_cases += daily_cases
            cumulative_deaths += daily_deaths

            # Calculate cases in the last 7 days, per region
            day = 0
            cases_last_7_days = 0

            while 7 - day >= 0:
                if record['geoId'] == previous_region:
                    # Remove the record
                    cases_last_7_days += int(data[index-day]['cases'])
                day += 1

            if daily_cases == 0:
                days_since_last_case += 1
            else:
                days_since_last_case = 0

            record['casesreportedLast7Days'] = cases_last_7_days
            record['cumulativeCases'] = cumulative_cases
            record['cumulativeDeaths'] = cumulative_deaths
            record['daysSinceLastCase'] = days_since_last_case

            previous_region = record['geoId']

            index += 1

        return data

    def add_extra_metadata(self, data) -> List[Dict]:
        for record in data:
            key = None
            if 'countryterritoryCode' in record and record['countryterritoryCode']:
                key = record['countryterritoryCode']
            elif 'geoId' in record and record['geoId']:
                key = record['geoId']

            if key is not None:
                if key in self.extra_metadata:
                    record.update(self.extra_metadata[key])

        return data

    def transform(self):
        # Calculate the cumulative total
        data = self.add_cumulative_totals(self.raw_data)
        # Add the additional metadata
        data = self.add_extra_metadata(data)
        # Dump the JSON data
        return json.dumps(data)


def handler(event, context):
    # Transform the data
    transformer = DataTransformer()
    data = transformer.transform()

    # Upload to S3
    response = s3_client.put_object(
        Body=data,
        Bucket=covid_data_bucket,
        Key=f'{datetime.now().strftime("%Y-%m-%d")}-COVID-19-Cases',
        ACL='public-read'
    )
    # Upload to S3 as most recent
    response = s3_client.put_object(
        Body=data,
        Bucket=covid_data_bucket,
        Key='daily_data.json',
        ACL='public-read'
    )
