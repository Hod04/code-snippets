import * as React from "react";
import { hot } from "react-hot-loader/root";
import { connect } from "react-redux";
import { fetchUser } from "./store/users/actions";

interface Props {
  user?: { name: string; id: number };
  userId?: number;
  fetchUser?: (userId: number) => {};
}

interface State {
  users?: { name: string; id: number }[];
}

class UserHeader extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchUser != null &&
      this.props.userId != null &&
      this.props.fetchUser(this.props.userId);
  }
  render() {
    const { user } = this.props;
    return <div>{user && user.name}</div>;
  }
}

const mapStateToProps = (state: State, ownProps: Props) => {
  return {
    user: state.users && state.users.find(user => user.id === ownProps.userId)
  };
};

export default connect(mapStateToProps, { fetchUser })(hot(UserHeader));
