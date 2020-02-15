import * as React from "react";
import { hot } from "react-hot-loader/root";
import * as _ from "lodash";
import { SnippetItem } from "../containers/SnippetListContainer";
import { Button, ButtonGroup } from "@blueprintjs/core";

interface Props {
  snippetItems: SnippetItem[];
  newSnippetFormActive: boolean;
}

interface State {
  showCode: boolean;
  activeItemId?: number;
}

class snippetItems extends React.Component<Props, State> {
  state: State = { showCode: false };

  // componentDidUpdate(prevProps: Props, prevState: State) {
  //   !_.isEqual(prevProps, this.props) || !_.isEqual(prevState, this.state);
  //   ? this.fetchData()
  //   : {};
  // }

  handleItemClick = (id: number) => {
    this.setState({
      showCode: !this.state.showCode,
      activeItemId: this.state.activeItemId !== id ? id : undefined
    });
  };

  renderSnippetItems() {
    const { snippetItems } = this.props;
    const { activeItemId } = this.state;
    return (
      !_.isEmpty(snippetItems) &&
      snippetItems.map((item: SnippetItem) => (
        <Button
          minimal
          disabled={this.props.newSnippetFormActive}
          key={item.id}
          style={{
            padding: "5px 50px 5px 10px",
            display: "block",
            maxWidth: 250,
            width: 140,
            background: activeItemId === item.id ? "#394b59" : "white",
            color: activeItemId === item.id ? "white" : ""
          }}
          active={activeItemId === item.id}
          onClick={() => this.handleItemClick(item.id)}
        >
          <strong>{item.title}</strong>
        </Button>
      ))
    );
  }

  renderCode() {
    const { activeItemId } = this.state;
    const snippet = _.find(
      this.props.snippetItems,
      item => item.id === activeItemId
    );
    return (
      activeItemId != null &&
      snippet != null && <div style={{}}>{snippet.code}</div>
    );
  }

  render() {
    return (
      <div style={{ display: "flex" }}>
        <ButtonGroup vertical> {this.renderSnippetItems()}</ButtonGroup>
        <div style={{ marginLeft: 100 }}>{this.renderCode()}</div>
      </div>
    );
  }
}

export default hot(snippetItems);
