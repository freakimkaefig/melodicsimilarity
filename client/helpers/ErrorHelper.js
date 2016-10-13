import LoginActions from '../actions/LoginActions';

class ErrorHelper {

  handleRequestError(error) {
    switch (error.status) {
      case 401:
        if (error.statusText === 'Unauthorized') {
          LoginActions.logoutUser();
        }
        break;
    }

    console.log(error);
  }

}

export default new ErrorHelper();