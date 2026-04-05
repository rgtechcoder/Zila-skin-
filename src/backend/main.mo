import Text "mo:core/Text";
import Map "mo:core/Map";

actor {
  let subscribers = Map.empty<Text, ()>();

  public shared ({ caller }) func subscribeToNewsletter(email : Text) : async Bool {
    let isNewSubscriber = not subscribers.containsKey(email);
    if (isNewSubscriber) {
      subscribers.add(email, ());
    };
    isNewSubscriber;
  };

  public query ({ caller }) func getNewsletterSubscriberCount() : async Nat {
    subscribers.size();
  };
};
