const storageService = jest.genMockFromModule('../storageService');

storageService.uploas = (file, destFileName, type, callback) => {
  if (file != null) {
    callback(false, {Location: file});
  } else {
    callback({text: 'Empty file!'}, file);
  }
};

module.exports = storageService;