import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Post = {
    id : Nat;
    author : ?Text;
    title : Text;
    content : Text;
    timestamp : Time.Time;
  };

  public type Comment = {
    id : Nat;
    author : ?Text;
    content : Text;
    postId : Nat;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextPostId = 0;
  var nextCommentId = 0;

  let posts = Map.empty<Nat, Post>();
  let comments = Map.empty<Nat, Comment>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Blog functions - public access
  public shared ({ caller }) func createPost(author : ?Text, title : Text, content : Text) : async Nat {
    let post : Post = {
      id = nextPostId;
      author;
      title;
      content;
      timestamp = Time.now();
    };
    posts.add(nextPostId, post);
    nextPostId += 1;
    post.id;
  };

  public query ({ caller }) func getPosts() : async [Post] {
    posts.values().toArray();
  };

  public shared ({ caller }) func createComment(author : ?Text, content : Text, postId : Nat) : async Nat {
    if (not posts.containsKey(postId)) {
      Runtime.trap("Post does not exist");
    };
    let comment : Comment = {
      id = nextCommentId;
      author;
      content;
      postId;
      timestamp = Time.now();
    };
    comments.add(nextCommentId, comment);
    nextCommentId += 1;
    comment.id;
  };

  public query ({ caller }) func getCommentsByPost(postId : Nat) : async [Comment] {
    let filtered = comments.values().filter(
      func(comment) {
        comment.postId == postId;
      }
    );
    filtered.toArray();
  };

  public query ({ caller }) func getAllComments() : async [Comment] {
    comments.values().toArray();
  };

  // Admin-only functions
  public shared ({ caller }) func deletePost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };
    if (not posts.containsKey(postId)) {
      Runtime.trap("Post does not exist");
    };
    posts.remove(postId);
    let toDelete = comments.entries().filter(
      func((_, comment)) {
        comment.postId == postId;
      }
    );
    toDelete.forEach(func((commentId, _)) { comments.remove(commentId) });
  };

  public shared ({ caller }) func deleteComment(commentId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete comments");
    };
    if (not comments.containsKey(commentId)) {
      Runtime.trap("Comment does not exist");
    };
    comments.remove(commentId);
  };
};
