import React, { userState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput } from "react-native";

import { firebase } from "@firebase/app";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions";
import { useState } from "react";

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  console.log("comment");

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }

        const user = props.users.find((x) => x.uid === comments[i].creator);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }

      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { d, ...data };
          });
          matchUserToComment(comment);
        });
      setPostId(props.route.parmas.postId);
    } else {
      matchUserTComment(comment);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .colletion("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      });
  };

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            {item.user !== undefined ? <Text>{item.user.name}</Text> : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View>
        <TextInput
          placeholder="comment..."
          onChangeText={(text) => setText(text)}
        />
        <Button onPress={() => onCommentSend()} title="Send" />
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
