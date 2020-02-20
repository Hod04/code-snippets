import * as React from "react";
import { hot } from "react-hot-loader/root";
import * as _ from "lodash";
import { SnippetItem } from "../containers/SnippetListContainer";
import { Button, ButtonGroup } from "@blueprintjs/core";
import { Controlled as CodeMirror } from "react-codemirror2";
require("codemirror/mode/javascript/javascript");

interface Props {
  snippetItems: SnippetItem[];
  newSnippetFormActive: boolean;
  updateSnippet: (listId: number, snippetId: number, code: string) => void;
  activeSnippetListKey: number;
  fetchSnippetItems: (listId: number) => void;
}

interface State {
  showCode: boolean;
  activeItemId?: number;
  code?: string;
}

class snippetItems extends React.Component<Props, State> {
  state: State = { showCode: false };

  componentDidUpdate(prevProps: Props) {
    if (this.props.activeSnippetListKey !== prevProps.activeSnippetListKey) {
      this.setState({ showCode: false, code: undefined });
    }
  }

  handleItemClick = (id: number) => {
    const itemBeingClickedOnceMore: boolean = this.state.activeItemId === id;
    this.setState(
      {
        showCode: itemBeingClickedOnceMore ? false : true,
        activeItemId: itemBeingClickedOnceMore ? undefined : id,
        code: ""
      },
      () => this.state.showCode && this.mapCodeToState()
    );
  };

  handleSaveCode = async () => {
    if (this.state.activeItemId == null) {
      return;
    }
    await this.props.updateSnippet(
      this.props.activeSnippetListKey,
      this.state.activeItemId,
      this.state.code || ""
    );
    this.props.fetchSnippetItems(this.props.activeSnippetListKey);
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

  mapCodeToState() {
    const { activeItemId } = this.state;
    const snippet = _.find(
      this.props.snippetItems,
      item => item.id === activeItemId
    );
    if (activeItemId != null && snippet != null) {
      this.setState({ code: snippet.code });
    }
  }

  render() {
    return (
      <div style={{ display: "flex" }}>
        <ButtonGroup vertical> {this.renderSnippetItems()}</ButtonGroup>
        {this.state.showCode && (
          <div style={{ marginLeft: 250, width: 400 }}>
            <CodeMirror
              value={this.state.code || ""}
              onBeforeChange={(editor, data, value) =>
                this.setState({ code: value })
              }
              options={{
                mode: "javascript",
                lineNumbers: true,
                theme: "material"
              }}
            />
            <Button
              style={{
                marginTop: 5,
                fontWeight: 700,
                color: "white",
                background: "rgb(57, 75, 89)"
              }}
              text={"Save"}
              onClick={this.handleSaveCode}
            />
          </div>
        )}
      </div>
    );
  }
}

export default hot(snippetItems);
