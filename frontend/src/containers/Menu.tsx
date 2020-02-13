import * as React from "react";
import { hot } from "react-hot-loader/root";
import { connect } from "react-redux";
import { toggleMenuItem } from "../store/Menu/actions";
import {
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Tabs,
  Tab,
  Icon
} from "@blueprintjs/core";

interface State {
  activeMenuItem: string;
}

class Menu extends React.Component<any, State> {
  handleItemClick = (tabId: string) =>
    this.props.toggleMenuItem(tabId as string);

  render() {
    const { activeMenuItem } = this.props;

    return (
      <Navbar className={"bp3-dark"}>
        <NavbarGroup>
          <Tabs selectedTabId={activeMenuItem} onChange={this.handleItemClick}>
            <Tab
              style={{ padding: "0 15px 0 15px", marginLeft: 15 }}
              id={"home"}
            >
              <Icon icon={"code"} />
            </Tab>
            <NavbarDivider />
            <Tab id={"snippet-lists"}>
              <Icon icon={"list"} /> {"My Lists"}
            </Tab>
            <Tab id={"favorites"}>
              <Icon icon={"tag"} /> {"Favorites"}
            </Tab>
            <Tab id={"examples"}>
              <Icon icon={"mountain"} /> {"Examples"}
            </Tab>
            <Tab id={"search"}>
              <Icon icon={"search"} /> {"Search"}
            </Tab>
          </Tabs>
        </NavbarGroup>
      </Navbar>
    );
  }
}
const mapStateToProps = (state: State) => {
  return {
    activeMenuItem: state.activeMenuItem
  };
};

export default connect(mapStateToProps, { toggleMenuItem })(hot(Menu));
