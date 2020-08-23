import React from "react";
import "emerald-ui/lib/styles.css";
import "./App.css";
import axios from "axios";
import constants from "./constants";
import utils from "./utils";
import NewQuoteModalComponent from "./Components/NewQuoteModalComponent/NewQuoteModalComponent";
import { Button, Carousel, Icon } from "emerald-ui/lib/";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: [],
      configs: {
        showModal: false,
      },
    };
  }

  componentDidMount = () => {
    axios({
      url: constants.BASE_PATH + constants.routes.quotes,
      method: "get",
    })
      .then((res) => {
        const quotes = res.data.quotes || []
        this.setState({
          quotes: utils.shuffle(quotes),
        });
      })
      .catch((err) => console.error(err));
  };

  shuffleList = (evt) =>
    this.setState({ quotes: utils.shuffle(this.state.quotes) });

  addQuoteToList = (quote)=>{
    const quotes = this.state.quotes || []
    quotes.push(quote)
    this.setState({
      quotes
    })
  }

  render() {
    const { quotes } = this.state;

    const elements = quotes.map((item, idx) => (
      <Carousel.Slide
        style={{ width: "50vw" }}
        key={`quotes-${idx}-${item._id}`}
      >
        <div className="quote-item-container">
          {item.isImage && <img src={item.url} alt="" />}
          <h2
            style={{
              fontSize: item.isImage ? "30px" : "45px",
            }}
          >
            {!item.isImage && `"${item.quote}"`}
          </h2>
          {item.artist && <p>By: {item.artist}</p>}
        </div>
      </Carousel.Slide>
    ));
    return (
      <div className="App">
        <div className="header-quotes">
          <h2>
            Frases celebres <br /> CondorLabs
          </h2>
        </div>
        <div className="quotes-container">
          {quotes.length && <Carousel innerMargin={20}>{elements}</Carousel>}
        </div>
        <div className="quotes-bottom-buttons">
          <Button onClick={this.shuffleList}>
            <Icon name="shuffle" />
            <span> Shuffle </span>
          </Button>
          <Button
            onClick={()=>this.setState({configs: {showModal: true}})}
          >
            <Icon name="add" />
            <span> Add </span>
          </Button>
          <NewQuoteModalComponent
            onSavedQuote={this.addQuoteToList}
            show={this.state.configs.showModal}
            close={()=>this.setState({ configs: { showModal: false } })}
          />
        </div>
      </div>
    );
  }
}

export default App;
