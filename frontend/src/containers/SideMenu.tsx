import * as React from "react";
import { hot } from "react-hot-loader/root";
import { Button, ButtonGroup, AnchorButton } from "@blueprintjs/core";

interface State {
  activeItem: string;
}

class SideMenu extends React.PureComponent<{}, State> {
  state = { activeItem: "gamepad" };

  handleItemClick = (name: string) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    const assignActiveItem = (activeItem: string) =>
      this.setState({ activeItem });

    return (
      <div>
        <ButtonGroup vertical>
          <Button
            intent={"primary"}
            active={activeItem === "Queries"}
            onClick={() => assignActiveItem("Queries")}
            icon="database"
          >
            Queries
          </Button>
          <Button
            active={activeItem === "Functions"}
            onClick={() => assignActiveItem("Functions")}
            icon="function"
          >
            Functions
          </Button>
          <Button
            active={activeItem === "Search"}
            intent="primary"
            onClick={() => assignActiveItem("Search")}
            icon="search"
          >
            Search
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default hot(SideMenu);
