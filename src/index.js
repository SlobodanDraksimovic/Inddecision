import React from "react";
import ReactDOM from "react-dom";

const rootElement = document.getElementById("root");

class Indecision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Indecision",
      sutitle: "",
      options: props.options
    };
    this.handleDeleteOption = this.handleDeleteOption.bind(this);
    this.handleDeleteOptionSingular = this.handleDeleteOptionSingular.bind(
      this
    );
    this.handleClick = this.handleClick.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
  }

  componentDidMount() {
    try {
      const json = localStorage.getItem("name");
      const options = JSON.parse(json);
      if (options) {
        this.setState(() => ({ options }));
      }
    } catch (e) {
      //Do nothing
    }
  }

  componentDidUpdate(prevState) {
    if (prevState.options.length !== this.state.options.length) {
      const json = JSON.stringify(this.state.options);
      localStorage.setItem("name", json);
    }
  }

  handleDeleteOption() {
    this.setState(() => ({
      options: []
    }));
  }

  handleClick() {
    if (this.state.options) {
      const option = Math.floor(Math.random() * this.state.options.length);
      alert(this.state.options[option]);
    }
  }

  handleAddOption(value) {
    if (!value) {
      return "Enter valide option!";
    } else if (this.state.options.indexOf(value) > -1) {
      return "You already have this option!";
    }

    this.setState(prevState => ({
      options: [...prevState.options, value]
    }));
  }

  handleDeleteOptionSingular(value) {
    this.setState(prevState => ({
      options: prevState.options.filter(option => value !== option)
    }));
  }

  render() {
    return (
      <div>
        <Heading title={this.state.title} subtitle={this.state.subtitle} />
        <Action
          isOptions={this.state.options.length > 0}
          handleClick={this.handleClick}
        />
        <Options
          options={this.state.options}
          handleDeleteOption={this.handleDeleteOption}
          handleDeleteOptionSingular={this.handleDeleteOptionSingular}
        />
        <AddOption handleAddOption={this.handleAddOption} />
      </div>
    );
  }
}

Indecision.defaultProps = {
  options: []
};

const Heading = props => {
  return (
    <div>
      {props.title && <h1>{props.title}</h1>}
      <h2>{props.subtitle}</h2>
    </div>
  );
};

Heading.defaultProps = {
  subtitle: "This is some dummy text about this application!"
};

const Action = props => {
  return (
    <div>
      <button disabled={!props.isOptions} onClick={props.handleClick}>
        What shuld I do?
      </button>
    </div>
  );
};

const Options = props => {
  return (
    <div>
      {props.options.length === 0 && <p>There is no options!</p>}
      <button onClick={props.handleDeleteOption}>Remove all</button>
      {props.options.map(option => (
        <Option
          key={option}
          optionText={option}
          handleDeleteOptionSingular={props.handleDeleteOptionSingular}
        />
      ))}
    </div>
  );
};

const Option = props => {
  return (
    <div>
      {props.optionText}
      <button
        onClick={() => {
          props.handleDeleteOptionSingular(props.optionText);
        }}
      >
        Remove
      </button>
    </div>
  );
};

class AddOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: undefined
    };
  }
  render() {
    const handleAdd = e => {
      e.preventDefault();
      const value = e.target.elements.option.value.trim();
      const err = this.props.handleAddOption(value);

      this.setState(() => ({ err }));
      if (!err) {
        e.target.elements.option.value = "";
      }
    };

    return (
      <div>
        {this.state.err && <p>{this.state.err}</p>}
        <form onSubmit={handleAdd}>
          <input type="text" name="option" />
          <button>Add Option</button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Indecision />
  </React.StrictMode>,
  rootElement
);
