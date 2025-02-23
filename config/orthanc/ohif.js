// https://orthanc.uclouvain.be/book/plugins/ohif.html



window.config = {
  // the following configuration options are overriden when using OHIF plugin for Orthanc
  // routerBasename: '/', // window.config.dataSources
  // dataSources: [], // window.config.dataSources
  // defaultDataSourceName: 'dicomweb', // window.config.defaultDataSourceName
  // showStudyList: false, //set to false if using the DICOM JSON data source
  // The values are from Orthanc configuration for OHIF plugin.

  extensions: [],
  modes: [],
  disableEditing: true,
  investigationalUseDialog: {
    option: 'never',
  },
  studyListFunctionsEnabled: false,


  httpErrorHandler: error => {
    // This is 429 when rejected from the public idc sandbox too often.
    console.warn(error.status);

    // Could use services manager here to bring up a dialog/modal if needed.
    console.warn('test, navigate to https://ohif.org/');
  },
};