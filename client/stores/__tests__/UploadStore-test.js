import { LIST_ACTIVE_CHANGE, SAVE_FILES_TO_UPLOAD, UPLOAD_FINISHED } from '../../constants/UploadConstants';
import { UPDATE_METADATA } from '../../constants/SolrConstants';

jest.mock('../../dispatchers/AppDispatcher');
jest.mock('../../helpers/ArrayHelper');

describe('UploadStore', () => {

  var AppDispatcher;
  var UploadStore;
  var callback;

  var metadataPlaceholder = { signature: 'abc123', title: 'Title 1' };

  var actionSetListActive = {
    actionType: LIST_ACTIVE_CHANGE,
    key: 1
  };

  var actionSaveFiles = {
    actionType: SAVE_FILES_TO_UPLOAD,
    files: [
      { key: 1, abc: 'abc', json: {}, metadata: {}, store: false, upload: true }
    ],
    metadata: [
      { signature: 'abc123', title: 'Title 1' }
    ]
  };

  var actionUpdateMetadataEmpty = {
    actionType: UPDATE_METADATA,
    response: {
      response: {
        start: 0,
        numFound: 0,
        docs: []
      }
    }
  };

  var actionUpdateMetadata = {
    actionType: UPDATE_METADATA,
    response: {
      response: {
        start: 0,
        numFound: 1,
        docs: [metadataPlaceholder]
      }
    }
  };

  var actionhandleUpload = {
    actionType: UPLOAD_FINISHED,
    response: {
      ok: 1,
      signature: 'abc123',
      value: {
        json: {},
        name: 'abc123.json',
        signature: 'abc123'
      }
    }
  };

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    UploadStore = require('../UploadStore').default;
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('initializes empty', () => {
    let {
      listActive,
      files,
      metadata,
      responses
    } = UploadStore;
    expect(listActive).toBe(null);
    expect(files.length).toBe(0);
    expect(metadata.length).toBe(0);
    expect(responses.length).toBe(0);
  });

  it('updates active list element', () => {
    callback(actionSetListActive);
    expect(UploadStore.listActive).toBe(1);
  });

  it('stores files for uploading', () => {
    callback(actionSaveFiles);
    expect(UploadStore.files.length).toBe(1);
    expect(UploadStore.metadata.length).toBe(1);
    expect(UploadStore.files[0].store).toBe(true);
  });

  it('updates metadata from solr', () => {
    callback(actionUpdateMetadataEmpty);
    expect(UploadStore.metadata.length).toBe(0);

    var ArrayHelper = require('../../helpers/ArrayHelper').default;
    ArrayHelper.mergeByProperty = jest.fn()
      .mockImplementationOnce(() => {
        UploadStore._metadata = [metadataPlaceholder];
      });
    callback(actionUpdateMetadata);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([], [metadataPlaceholder], 'signature');
    expect(UploadStore.metadata.length).toBe(1);
    expect(UploadStore.metadata).toEqual([metadataPlaceholder]);
  });

  it('handles upload responses', () => {
    callback(actionhandleUpload);
    expect(UploadStore.files.length).toBe(0);
    expect(UploadStore.responses.length).toBe(1);
    expect(UploadStore.responses[0].ok).toBe(1);
    expect(UploadStore.responses[0].signature).toBe('abc123');
  });

});