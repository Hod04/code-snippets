import * as React from "react";
import { hot } from "react-hot-loader/root";
import * as _ from "lodash";
import { SnippetItem } from "./SnippetListContainer";

interface Props {
  snippetItems: SnippetItem[];
}

interface State {}

class snippetItem extends React.Component<Props, State> {
  state: State = {};

  // componentDidUpdate(prevProps: Props, prevState: State) {
  //   !_.isEqual(prevProps, this.props) || !_.isEqual(prevState, this.state);
  //   // ? this.fetchData()
  //   // : {};
  // }

  renderSnippetItems() {
    const { snippetItems } = this.props;
    return (
      !_.isEmpty(snippetItems) &&
      snippetItems.map((item: SnippetItem) => (
        <div key={item.id}>
          {item.title}
          {item.code || ""}
        </div>
      ))
    );
  }
  render() {
    return <div style={{ padding: 50 }}>{this.renderSnippetItems()}</div>;
  }
}

export default hot(snippetItem);
