import React, { Component } from "react";
import { Modal, Button, Spinner, TextField, Checkbox } from "emerald-ui/lib";
import axios from "axios";
import constants from "../../constants";
import swal from "sweetalert2";
class NewQuoteModalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      quote: "",
      artist: "",
      nickname: "",
      isImage: false
    };
  }

  onChangeTextField = (evt, name) => {
    evt.preventDefault();
    this.setState({
      [name]: evt.target.value,
    });
  };

  onSaveQuote = (evt) => {
    const { BASE_PATH, routes } = constants;
    const { quote, artist, nickname, isImage } = this.state;
    if (!quote || !artist || !nickname) {
      this.setState({
        quote: "",
        artist: "",
        nickname: "",
        isImage: false
      });
      this.props.close();
      return swal.fire({
        icon: "warning",
        title: "400 - Missing fields",
      });
    }

    const data = {
      url: isImage && quote,
      quote: !isImage ? quote : undefined,
      artist,
      isImage
    };
    this.setState({ isLoading: true });
    axios({
      method: "post",
      url: BASE_PATH + routes.quotes,
      data,
      headers: {
        Authorization: `Baisc ${new Buffer(`${nickname}:123`).toString(
          "base64"
        )}`,
      },
    })
      .then((res) => {
        this.setState({ isLoading: false });
        this.props.close();
        swal.fire({
          icon: "success",
          title: "201 - Quote add successfully",
        });
        this.props.onSavedQuote(data)
      })
      .catch((err) => console.error(err));
  };

  render = () => {
    return (
      <React.Fragment>
        <Modal onHide={this.props.close} show={this.props.show}>
          <Modal.Header closeButton={true}>
            <Modal.Title>Add new quote: </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                value={this.state.quote}
                onChange={(evt) => this.onChangeTextField(evt, "quote")}
                style={{ width: "100%" }}
                label={this.state.isImage ? "Url: ":"Quote: "}
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                value={this.state.artist}
                onChange={(evt) => this.onChangeTextField(evt, "artist")}
                style={{ width: "100%" }}
                label="Artist: "
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                value={this.state.nickname}
                onChange={(evt) => this.onChangeTextField(evt, "nickname")}
                style={{ width: "100%" }}
                label="Your Nickname: "
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox defaultChecked={this.state.isImage} onChange={()=>this.setState({isImage: !this.state.isImage})} label="is an url image?" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close} shape="flat" color="info">
              Cancel
            </Button>
            <Button onClick={this.onSaveQuote} color="primary">
              {this.state.isLoading && <Spinner size="sm"/>}
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  };
}

export default NewQuoteModalComponent;
