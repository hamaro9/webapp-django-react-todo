import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";
import Cookies from 'js-cookie';

const csrfToken = Cookies.get('csrftoken');

const instance = axios.create({
  headers: { 'X-CSRFToken': csrfToken }
});

const styles = {
  fontFamily: 'Mulish, sans-serif',
  fontSize: '14px',
};

const spanStyle = {
  width: '50%',
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],
      modal: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
    };
  }
  

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item, {headers: {'X-CSRFToken' : csrfToken}})
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item, {headers: {'X-CSRFToken' : csrfToken}})
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}/`, {headers: {'X-CSRFToken' : csrfToken}})
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  searchHandler = (event) => {
    console.log(event.target.value)
  }

  renderTabList = () => {
    return (
      <div style={styles} className="nav nav-tabs tabs-list">
        <form className={"form-inline my-2 my-lg-0"}>
      <input onChange={this.searchHandler} className={"form-control mr-sm-2"} type="search" placeholder="Пребарај" aria-label="Search"></input>
      <button className={"btn btn-outline-success my-2 my-sm-0"} type="submit">Пребарај</button>
    </form>
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Готови
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Неизвршени
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span style={spanStyle}>
          <button
            className="btn btn-secondary mr-2 btn-block"
            onClick={() => this.editItem(item)}
          >
            Измени
          </button>
          <button
            className="btn btn-outline-danger btn-block"
            onClick={() => this.handleDelete(item)}
          >
            Избриши
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main style={styles} className="container">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-outline-primary btn-block"
                  onClick={this.createItem}
                >
                  Додади
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;