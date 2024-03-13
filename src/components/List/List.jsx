import React, { PureComponent } from "react";
import "./styles.css";

export default class List extends PureComponent {
  state = {
    list: [],
  };
  async componentDidMount() {
    try {
      let req = await fetch(
          `https://65ef5bb3ead08fa78a5055fb.mockapi.io/todos`
        ),
        res = await req.json();
      this.setState({
        list: res,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async handleDelete(id) {
    try {
      await fetch(`https://65ef5bb3ead08fa78a5055fb.mockapi.io/todos/${id}`, {
        method: `DELETE`,
      });
      this.setState((actualState) => ({
        list: actualState.list.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async handleComplete(event, id) {
    try {
      let request = await fetch(
          `https://65ef5bb3ead08fa78a5055fb.mockapi.io/${id}`,
          {
            method: `PATCH`,
            body: JSON.stringify({ completed: event.target.checked }),
            headers: {
              "Content-type": "application/json",
            },
          }
        ),
        response = await request.json();

      this.setState((actualState) => ({
        list: actualState.list.map((el) => {
          if (el.id === response.id) el = response;
          return el;
        }),
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async handleChangeTitle(event, id) {
    try {
      await fetch(`https://65ef5bb3ead08fa78a5055fb.mockapi.io/${id}`, {
        method: `PATCH`,
        body: JSON.stringify({ title: event.target.value }),
        headers: {
          "Content-type": "application/json",
        },
      });

      const updatedElement = this.state.list.map((el) => {
        if (el.id === id) {
          return { ...el, title: event.target.value };
        }
        return el;
      });

      this.setState(() => ({
        list: updatedElement,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { list } = this.state;

    return list.length ? (
      <ul>
        {list.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              defaultChecked={item.completed}
              onChange={(e) => this.handleComplete(e, item.id)}
            />
            <input
              type="text"
              defaultValue={item.title}
              onChange={(e) => this.handleChangeTitle(e, item.id)}
              className="title"
            />
            <button onClick={() => this.handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    ) : null;
  }
}
