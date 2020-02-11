import * as React from "react";
import { hot } from "react-hot-loader/root";
import { connect } from "react-redux";
import { fetchPosts } from "./store/posts/actions";
import UserHeader from "./UserHeader";

interface Post {
  userId?: number;
  body?: string;
  title?: string;
  id?: number;
}

interface Props {
  posts?: Post[];
  fetchPosts?: () => {};
}

interface State {
  posts?: Post[];
}

class PostList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPosts && this.props.fetchPosts();
  }
  renderList() {
    const { posts } = this.props;
    return (
      posts &&
      posts.map((post: Post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <UserHeader userId={post.userId} />
        </div>
      ))
    );
  }
  render() {
    return <div>{this.renderList()}</div>;
  }
}

const mapStateToProps = (state: State) => {
  return {
    posts: state.posts || [{}]
  };
};

export default connect(mapStateToProps, { fetchPosts })(hot(PostList));
