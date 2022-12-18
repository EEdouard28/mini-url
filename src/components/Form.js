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
}
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
validateInput = async () => {
  var errors = [];
  var errorMessages = this.state.errorMessage;

  //   validate long URL
  if (this.state.longURL.length === 0) {
    errors.push('longURL');
    errorMessages['longURL'] = 'Please enter your URL!';
  } else if (!isWebUri(this.state.longURL)) {
    errors.push('longURL');
    errorMessages['longUrl'] = 'Please place a URL in form of htttps://www....';
  }
};
