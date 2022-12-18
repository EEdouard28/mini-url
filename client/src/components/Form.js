import React from 'react';
// generates Ids URL safe
import { nanoid } from 'nanoid';
// firebase database methods
import { getDatabase, child, ref, set, get } from 'firebase/database';
// validates web url
import { isWebUri } from 'valid-url';
import { OverlayTrigger } from 'react-bootstrap';
// message
import Tooltip from 'react-bootstrap';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // stores long URL input made by user
      longURL: '',
      //   stores users preferedAlias
      preferedAlias: '',
      //   generated URL for user auto generated or users input
      generatedURL: '',
      //   visual loading
      loading: false,
      //   keep track of fields with errors
      errors: [],
      errorMessage: {},
      toolTipMessage: 'Copy To Clip Board',
    };
  }
  //   When the user clicks submit, this will be called
  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
      generatedURL: '',
    });
    // validate the input the user has submitted
    var isFormValid = await this.validateInput();
    if (!isFormValid) {
      return;
    }

    // if the user has input a preferred alias then we use it, if not, we genertae one
    // Be sure to change minilinkit.com to your domain
    var generatedKey = nanoid(5);
    var generatedURL = 'minilinkit.com/' + generatedKey;

    if (this.state.preferedAlias !== '') {
      generatedKey = this.state.preferedAlias;
      generatedURL = 'minilinkit.com/' + this.state.preferedAlias;
    }
    // content added to firebase database
    const db = getDatabase();
    // set method passed to database and path of generated key
    set(ref(db, '/' + generatedKey), {
      generatedKey: generatedKey,
      longURL: this.state.longURL,
      preferedAlias: this.state.preferedAlias,
      generatedURL: generatedURL,

      //   after data is passed set state of generated url
    })
      .then((results) => {
        this.setState({
          generatedURL: generatedURL,
          loading: false,
        });
      })
      //   handle error
      .catch((e) => {});
  };
  // checks if field has an error
  hasError = (key) => {
    return this.state.errors.indexOf(key) !== -1;
  };

  // Save the content of the form as the user is typing!
  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  // ensure form input is valid
  validateInput = async () => {
    var errors = [];
    var errorMessages = this.state.errorMessage;

    //   validate long URL
    //   if url length is 0 error messages is returned
    if (this.state.longURL.length === 0) {
      errors.push('longURL');
      errorMessages['longURL'] = 'Please enter your URL!';
      // if url is not a proper url
    } else if (!isWebUri(this.state.longURL)) {
      errors.push('longURL');
      errorMessages['longUrl'] =
        'Please place a URL in form of htttps://www....';
    }

    // Prefered Alias
    if (this.state.preferedAlias !== '') {
      // if characters is more than 7 characters return error
      if (this.state.preferedAlias.length > 7) {
        errors.push('suggestedAlias');
        errorMessages['suggestedAlias'] =
          'Please Enter an Alias less than 7 Characters';
        //checks to see if preferred alias has space
      } else if (this.state.preferedAlias.indexOf(' ') >= 0) {
        errors.push('suggestedAlias');
        errorMessages['suggestedAlias'] = 'Spaces are not allowed in URLS';
      }
      //   does url already exist?
      var keyExists = await this.checkKeyExists();

      if (keyExists.exists()) {
        errors.push('suggestedAlias');
        errorMessages['suggestedAlias'] =
          'The Alias you have entered already exists! Please enter another one =-)';
      }
    }
    //update state of page
    this.setState({
      errors: errors,
      errorMessages: errorMessages,
      loading: false,
    });
    if (errors.length > 0) {
      return false;
    }
    return true;
  };

  //   Fetch database of alias inputted by user and checks if key exists
  checkKeyExists = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${this.state.preferedAlias}`)).catch((error) => {
      return false;
    });
  };

  //   copies generated URL to clipboard
  copyToClipBoard = () => {
    navigator.clipboard.writeText(this.state.generatedURL);
    this.setState({
      toolTipMessage: 'Copied',
    });
  };
  render() {
    return (
      <div classNmae="container">
        <form autoComplte="off">
          <h3>Mini Url!</h3>
          <div className="form-group">
            <input
              id="longURL"
              onChange={this.handleChange}
              value={this.state.longURL}
              type="url"
              required
              className={
                this.hasError('longURL')
                  ? 'form-control is-invalid'
                  : 'form-control'
              }
              placeholder="https://www..."
            />
          </div>
          <div
            className={
              this.hasError('longURL') ? 'text-danger' : 'visually-hidden'
            }
          >
            {this.state.errorMessage.longURL}
          </div>
          {/*  */}
          <div className="form-group">
            <label htmlFor="basic-url">Your Mini URL</label>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">miniURL</span>
              </div>
              <input
                id="preferedAlias"
                onChange={this.handleChange}
                value={this.state.preferedAlias}
                className={
                  this.hasError('preferedAlias')
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                type="text"
                placeholder="eg. 3fwias (Optional)"
              />
            </div>
            <div
              className={
                this.hassError('suggestedAlias')
                  ? 'text-danger'
                  : 'visually-hidden'
              }
            >
              {this.state.errorMessage.suggestedAlias}
            </div>
          </div>
          {/* button  */}
          <button
            className="btn btn-primary"
            type="button"
            onClick={this.onSubmit}
          >
            {this.state.loading ? (
              <div>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </div>
            ) : (
              <div>
                <span
                  className="visually-hidden spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>mini URL</span>
              </div>
            )}
          </button>
          {this.state.generatedURL === '' ? (
            <div></div>
          ) : (
            <div className="generatedurl">
              <span>Your generated URL is: </span>
              <div className="input-group mb-3">
                <input
                  disabled
                  type="text"
                  value={this.state.generatedURL}
                  className="form-control"
                  placeholder="Recipient username"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <OverlayTrigger
                    key={'top'}
                    placement={'top'}
                    overlay={
                      <Tooltip id={`tooltip-${'top'}`}>
                        {this.state.toolTipMessage}
                      </Tooltip>
                    }
                  >
                    <button
                      onClick={() => this.copyToClipBoard()}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top"
                      className="btn btn-outline-secondary"
                      type="button"
                    >
                      Copy
                    </button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }
}
export default Form;
