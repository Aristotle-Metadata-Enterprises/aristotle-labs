<template>
    <div class="container">
        <div class="mt-3 mb-3">
            <div class="row">
                <div class="col-12">
                    <h1 class="text-center">
                        Aristotle Simple Data Dictionary Format <i class="fas fa-file-excel" /> <i class="fas fa-file-csv" />
                    </h1>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <h2>Demo</h2>
                </div>
                <div class="col-12">
                    Jump straight in an try a <a href="https://aristotle.cloud/toolbox/sddf">demo of the Simple Data Dictionary Importer at Aristotle.Cloud</a>.
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <h2>
                        Summary
                    </h2>
                </div>
                <div class="col-12">
                    <p>
                        The Simple Data Dictionary Format is a simple way of recording a <em>data dictionary</em> for a spreadsheet, data table or data asset.
                    </p>
                    <div class="row">
                        <p class="col-md-6">
                            A <em>data dictionary</em> is a document that records field names from data, along with definition of key
                            concepts such as who data was collected from, how the data was stored and what type of data is
                            stored for a given field. By recording a data dictionary in a consistent, simple and structured
                            format it is easier to interpret data accurately.
                            To provide consistency between data dictionaries, this document use terminology from
                            ISO 11179, a widely recognised standard for metadata registries, for describing fields within a
                            data dictionary. By using existing metadata standards this format makes it easy to build and share
                            data dictionaries and import them into ISO 11179 compliant metadata registries, like the <a href="https://www.aristotlemetadata.com">Aristotle Metadata Registry</a>.
                        </p>
                        <div class="col-md-6">
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/aOVN0v-HWcQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <h2>
                File Structure
            </h2>
            <p>
                Each SDDF file describes a single <em>data asset</em>, such as a single CSV file or by a sheet within an Excel document, or single table in a database.
                This table will begin with a header that defines the fields used in the dictionary.
                These fields are given consistent names selected from those described within this document.
                Each row within the table maps to one single column or field within the data asset, as well as a single data element within the Data Dictionary.
            </p><p>
                Where each row maps to a specific field from a data asset a “Column name” field should be included to record the name of that field.
            </p>
            <div class="row pt-4">
                <div class="col-12">
                    <h3>
                        ISO 11179 Metadata types
                    </h3>
                </div>
                <div class="col-10 offset-1 pt-3">
                    <table class="table table-striped table-sm table-bordered">
                        <thead>
                        <tr>
                            <th scope="col">
                                Metadata Type
                            </th>
                            <th scope="col">
                                Description
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">
                                Data Element
                            </th>
                            <td>
                                A precise way of defining how a measurable attribute of a set of objects may be recorded in a system, using reusable metadata components.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Data Element Concept
                            </th>
                            <td>
                                A valid pairing of an Object Class and a Property to define a measurable attribute of the object, idea or event being observed.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Object Class
                            </th>
                            <td>
                                A definition for classifying a set of real objects, ideas or events that all share common measurable attributes.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Property
                            </th>
                            <td>
                                A definition of an attribute common to all members of a set defined by an Object Class.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Value Domain
                            </th>
                            <td>
                                A definition of how to record the measurement a particular attribute, either using a coded list of values or a description of the possible values.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Data Type
                            </th>
                            <td>
                                A description of the range of values that can be used to record information, as well as any valid operations that can be performed on the data.
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="row">
                <div class="col-12 text-center">
                    <img src="@/assets/metadata_relationships.png" alt="metadata_relationships">
                </div>
                <div class="col-12 text-center">
                    Figure 1: Relationship between ISO 11179 metadata type
                </div>
            </div>

            <h3>
                Field names
            </h3>
            <p>
                Fields are defined within the header of each column within the data dictionary. The mapping of a value to
                the metadata registry field name is done by stating the metadata type and the field name, for example “<b>Data
                Element</b> <i>Definition</i>” where the bolded text shows the metadata type (“Data Element”) and the italic text shows
                the field (“Definition”).
            </p>

            <div class="row">
                <div class="col-12">
                    <h4>
                        Common fields
                    </h4>
                    <p>
                        Common fields are those that can be recorded for any metadata type:
                    </p>
                </div>
                <div class="col-12">
                    <dl class="row">
                        <dt class="offset-1 col-sm-2">
                            Definition
                        </dt>
                        <dd class="col-sm-9">
                            The definition of the metadata item within this data dictionary.
                        </dd>

                        <dt class="offset-1 col-sm-2">
                            References
                        </dt>
                        <dd class="col-sm-9">
                            A reference to the source from which the definition text is taken.
                        </dd>

                        <dt class="offset-1 col-sm-2">
                            Comments
                        </dt>
                        <dd class="col-sm-9">
                            Additional comments about the metadata item, such as a guide for use or notes about its origin.
                        </dd>
                    </dl>
                </div>
            </div>
            <h3>
                Specific fields
            </h3>
            <p>
                Metadata type specific fields are listed below:
            </p>

            <div class="row">
                <div class="col-10 offset-1">
                    <table class="table table-striped table-sm table-bordered">
                        <thead>
                        <tr>
                            <th scope="col">
                                Metadata Type
                            </th>
                            <th scope="col">
                                Fields
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">
                                Data Element
                            </th>
                            <td>
                                Common fields only
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Data Element Concept
                            </th>
                            <td>
                                Common fields only
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Object Class
                            </th>
                            <td>
                                Common fields only
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Property
                            </th>
                            <td>
                                Common fields only
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Value Domain
                            </th>
                            <td>
                                Common fields<br>
                                Permissible Values<br>
                                Supplementary Values<br>
                                Format<br>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Data Type
                            </th>
                            <td>
                                Common fields only
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <h3>
                Field order
            </h3>

            Mapping of fields in the dictionary to values in a metadata registry can be determined from header field definitions, so ordering is not required for import and structuring of information.
            For consistency and readability, it is recommended fields are stored in in the following order:
            <div class="d-flex justify-content-center pt-4 pb-4">
                <ol>
                    <li>
                        Data Element
                    </li>
                    <li>
                        Data Element Concept
                    </li>
                    <li>
                        Object Class
                    </li>
                    <li>
                        Property
                    </li>
                    <li>
                        Value Domain
                    </li>
                    <li>
                        Data Type
                    </li>
                </ol>
            </div>
            <h3>
                Reusing records
            </h3>
            <p>
                If a metadata object needs to be reused throughout the dictionary, such as a common Object Class such as
                “Business”, to prevent re-entry of content the name is used as a key for identifying duplicate information.
            </p>
            <p>
                During import a metadata object is only created when a name for an object is first encountered.
                All subsequent uses of the name will refer to the original entry.
            </p>
            <p>
                For example, for the following table, if imported only one Object Class would be created – “Business”
                with the definition “An organization or entity engaged in commercial activities”. All other records that refer to a business would link to this Object Class.
            </p>

            <div class="row pb-5">
                <div class="col-12 d-flex justify-content-center">
                    <table class="excel-table-2007">
                        <thead>
                        <tr>
                            <th>
                                <img src="@/assets/excel-2007-header-left.gif" alt="excel-type-header">
                            </th>
                            <th scope="col">
                                Object Class
                            </th>
                            <th scope="col">
                                Object Class Definition
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td class="heading" scope="row">
                                1
                            </td>
                            <td>
                                Business
                            </td>
                            <td>
                                An organization or entity engaged in commercial activities
                            </td>
                        </tr>
                        <tr>
                            <td class="heading" scope="row">
                                2
                            </td>
                            <td>
                                Business
                            </td>
                            <td />
                        </tr>
                        <tr>
                            <td class="heading" scope="row">
                                3
                            </td>
                            <td>
                                Business
                            </td>
                            <td>
                                A company that performs services.
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row pt-4 pb-4">
                <div class="col-12">
                    <h3>
                        Rules for including fields
                    </h3>
                </div>

                <div class="col-10 offset-1">
                    <table class="table table-striped table-sm table-bordered">
                        <thead>
                        <tr>
                            <th scope="col">
                                Metadata Type
                            </th>
                            <th scope="col">
                                Rules
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">
                                Data Element
                            </th>
                            <td>
                                A Data Element should always be present.
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Data Element Concept
                            </th>
                            <td>
                                <ul>
                                    <li>
                                        If the “Data Element” is not present in the row, a Data Element Concept will be
                                        created but will not be related to any Data Element.
                                    </li>
                                    <li>
                                        If the “Data Element Concept” is empty, this is computed by concatenating the names of
                                        the “Object Class” and “Property” in the same row, separated by a colon ":".
                                    </li>
                                    <li>
                                        If the "Data Element Concept name" is empty and the fields "Object Class" and "Property
                                        name" are empty too, a Data Element Concept will not be created for that row.
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Object Class
                            </th>
                            <td>
                                <ul>
                                    <li>
                                        If “Data Element Concept” field is not present in the row, an Object Class will be
                                        created but will not be related to any Data Element Concept.
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Property
                            </th>
                            <td>
                                <ul>
                                    <li>
                                        If “Data Element Concept” field is not present in the row, a Property will be
                                        created but will not be related to any Data Element Concept.
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Value Domain
                            </th>
                            <td>
                                <ul>
                                    <li>
                                        If “Data Element” field is not present in the row, a Value Domain will be created
                                        but will not be related to any Data Element.
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                Data Type
                            </th>
                            <td>
                                <ul>
                                    <li>
                                        If “Value Domain” field is not present in the row, a Data Type will be created
                                        but will not be related to any Value Domain.
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <h3>
                Compatibility with Distributions and Data Set Specifications
            </h3>
            <p>
                In order to add definitions to a Distribution or a Data Set Specification from the SDDF importer follow
                these steps:
            </p>
            <ol>
                <li>
                    Click on the "Import definitions from SDDF" button located in the Actions tab of the item page.
                    <div class="text-center pt-4 pb-5">
                        <img src="@/assets/import_definitions_from.png" alt="aristotle-actions">
                    </div>
                </li>
                <li>
                    Add an extra column to your excel file named "Logical Path" if you are importing from a Distribution
                    or "Reference" if you are importing from a Data Set Specification.
                    <div class="row pt-4 pb-5">
                        <div class="col-12 d-flex justify-content-center">
                            <table class="excel-table-2007">
                                <thead>
                                <tr>
                                    <th>
                                        <img src="@/assets/excel-2007-header-left.gif" alt="excel-type-header">
                                    </th>
                                    <th scope="col">
                                        Reference
                                    </th>
                                    <th scope="col">
                                        Object Class
                                    </th>
                                    <th scope="col">
                                        Object Class Definition
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td class="heading" scope="row">
                                        1
                                    </td>
                                    <td>
                                        Ref
                                    </td>
                                    <td>
                                        Business
                                    </td>
                                    <td>
                                        An organization or entity engaged in commercial activities
                                    </td>
                                </tr>
                                <tr>
                                    <td class="heading" scope="row">
                                        2
                                    </td>
                                    <td>
                                        Ref
                                    </td>
                                    <td>
                                        Person
                                    </td>
                                    <td>
                                        a human being, whether an adult or child
                                    </td>
                                </tr>
                                <tr>
                                    <td class="heading" scope="row">
                                        3
                                    </td>
                                    <td>
                                        Ref
                                    </td>
                                    <td>
                                        Age
                                    </td>
                                    <td>
                                        The length of time that a person has lived or a thing has existed
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </li>
            </ol>

            <div class="row">
                <div class="col-10 offset-1">
                </div>
            </div>
            <div class="row pt-4 pb-4">
                <div class="col-12">
                    <h3>
                        Additional help
                    </h3>
                </div>
                <div class="col-10 offset-1">
                    <p>
                        If you have questions about the Simple Data Dictionary Format,
                        need help producing a valid data dictionary or have recommendations or suggestions for how we can improve the SDDF tools
                        <a href="https://community.aristotlemetadata.com/">sign up to our
                        metadata community and let us know your thoughts</a>.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SddfPage",
}
</script>

<style scoped>
.excel-table-2007 {
	border: 1px solid #B0CBEF;
	border-width: 1px 0px 0px 1px;
	font-size: 11pt;
	font-family: Calibri;
	font-weight: 100;
	border-spacing: 0;
	border-collapse: collapse;
}

.excel-table-2007 th {
    background-image: url('~@/assets/excel-2007-header-bg.gif');
	background-repeat: repeat-x;
    background-size: contain;
	font-weight: normal;
	font-size: 14px;
	border: 1px solid #9EB6CE;
	border-width: 0px 1px 1px 0px;
	height: 17px;
}

.excel-table-2007 td {
    border: 0px;
    background-color: white;
	padding: 0 4px 0 2px;
	border: 1px solid #D0D7E5;
	border-width: 0px 1px 1px 0px;
}

.excel-table-2007 td b {
	border: 0;
	background-color: white;
	font-weight: bold;
}

.excel-table-2007 td.heading {
	background-color: #E4ECF7;
	text-align: center;
	border: 1px solid #9EB6CE;
	border-width: 0px 1px 1px 0px;
    padding: 0;
}
</style>
