import * as React from "react";
import { hot } from "react-hot-loader/root";
import * as _ from "lodash";
import { SnippetItem } from "../containers/SnippetListContainer";
import { Card, H2, Button, ButtonGroup } from "@blueprintjs/core";

interface Props {
  snippetItems: SnippetItem[];
}

interface State {
  showCode: boolean;
  activeItemId?: number;
}

class snippetItems extends React.Component<Props, State> {
  state: State = { showCode: false };

  // componentDidUpdate(prevProps: Props, prevState: State) {
  //   !_.isEqual(prevProps, this.props) || !_.isEqual(prevState, this.state);
  //   // ? this.fetchData()
  //   // : {};
  // }

  handleItemClick = (id: number) => {
    this.setState({ showCode: !this.state.showCode, activeItemId: id });
  };

  renderSnippetItems() {
    const { snippetItems } = this.props;
    return (
      !_.isEmpty(snippetItems) &&
      snippetItems.map((item: SnippetItem) => (
        <Button
          minimal
          key={item.id}
          style={{
            padding: "5px 50px 5px 10px",
            display: "block",
            width: 250
          }}
          active={this.state.activeItemId === item.id}
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
    return activeItemId != null && snippet != null && <div>{snippet.code}</div>;
  }

  render() {
    return (
      <>
        <div style={{ marginLeft: 200 }}>
          <H2 style={{ padding: "20px 20px 20px 0px" }}>{"Code Snippets"}</H2>
          <ButtonGroup vertical> {this.renderSnippetItems()}</ButtonGroup>
        </div>
        <div style={{ padding: 100 }}>{this.renderCode()}</div>
      </>
    );
  }
}

export default hot(snippetItems);
