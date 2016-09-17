import {
  LIST_ACTIVE_CHANGE,
  SAVE_FILES_TO_UPLOAD,
  UPLOAD_FINISHED
} from '../../constants/UploadConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('UploadActions', () => {

  var AppDispatcher;
  var UploadActions;

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    UploadActions = require('../UploadActions').default;
  });

  it('dispatches list selection', () => {
    UploadActions.setListActive(1);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: LIST_ACTIVE_CHANGE,
      key: 1
    });
  });

  it('dispatches file save', () => {
    UploadActions.saveFiles([
      { signature: 'file1' },
      { signature: 'file2' }
    ], [
      { title: 'Title 1' },
      { title: 'Title 2' }
    ]);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: SAVE_FILES_TO_UPLOAD,
      files: [
        { signature: 'file1' },
        { signature: 'file2' }
      ],
      metadata: [
        { title: 'Title 1' },
        { title: 'Title 2' }
      ]
    });
  });

  it('dispatches upload handling', () => {
    UploadActions.handleUpload({ signature: 'file1', ok: 1 });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPLOAD_FINISHED,
      response: { signature: 'file1', ok: 1 }
    });
  });

});