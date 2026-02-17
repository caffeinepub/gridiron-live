import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Migration "migration";

(with migration = Migration.run)
actor {
  type TeamIcon = {
    #dolphin;
    #bullfrog;
    #fist;
    #tornado;
  };

  type Scoreboard = {
    team1Score : Nat;
    team2Score : Nat;
    team1Icon : TeamIcon;
    team2Icon : TeamIcon;
  };

  type EventType = {
    #flag;
    #point;
  };

  type FlagEvent = {
    team : Text;
    reason : Text;
    timestamp : Time.Time;
  };

  type Event = {
    timestamp : Time.Time;
    description : Text;
    eventType : EventType;
    flagEvent : ?FlagEvent;
  };

  module Event {
    public func compare(event1 : Event, event2 : Event) : Order.Order {
      Int.compare(event1.timestamp, event2.timestamp);
    };
  };

  type Session = {
    broadcaster : Text;
    startTime : Time.Time;
    endTime : ?Time.Time;
    events : List.List<Event>;
    scoreboard : Scoreboard;
    flagOverlays : List.List<FlagEvent>;
  };

  let sessions = Map.empty<Text, Session>();

  func getSessionOrTrap(sessionCode : Text) : Session {
    switch (sessions.get(sessionCode)) {
      case (null) { Runtime.trap("Session does not exist") };
      case (?session) { session };
    };
  };

  public query ({ caller }) func isValidSessionCode(sessionCode : Text) : async Bool {
    sessions.containsKey(sessionCode);
  };

  public shared ({ caller }) func startSession(broadcaster : Text, sessionCode : Text) : async () {
    if (sessions.containsKey(sessionCode)) {
      Runtime.trap("Session code already in use");
    };
    let newSession : Session = {
      broadcaster;
      startTime = Time.now();
      endTime = null;
      events = List.empty<Event>();
      scoreboard = {
        team1Score = 0;
        team2Score = 0;
        team1Icon = #dolphin;
        team2Icon = #bullfrog;
      };
      flagOverlays = List.empty<FlagEvent>();
    };
    sessions.add(sessionCode, newSession);
  };

  public shared ({ caller }) func endSession(sessionCode : Text) : async () {
    let session = getSessionOrTrap(sessionCode);
    if (session.endTime != null) {
      Runtime.trap("Session already ended");
    };
    let updatedSession : Session = {
      broadcaster = session.broadcaster;
      startTime = session.startTime;
      endTime = ?Time.now();
      events = session.events;
      scoreboard = session.scoreboard;
      flagOverlays = session.flagOverlays;
    };
    sessions.add(sessionCode, updatedSession);
  };

  public shared ({ caller }) func addEvent(sessionCode : Text, description : Text, eventType : EventType) : async () {
    let session = getSessionOrTrap(sessionCode);

    if (session.endTime != null) {
      Runtime.trap("Cannot add events to a finished session");
    };

    var newEvent : Event = {
      timestamp = Time.now();
      description;
      eventType;
      flagEvent = null;
    };

    if (eventType == #flag) {
      Runtime.trap("Please use addFlagEvent for flag events");
    };

    session.events.add(newEvent);
  };

  public query ({ caller }) func getEvents(sessionCode : Text) : async [Event] {
    let session = getSessionOrTrap(sessionCode);
    session.events.toArray().sort();
  };

  public query ({ caller }) func getSessionMetadata(sessionCode : Text) : async (Text, Time.Time, ?Time.Time) {
    let session = getSessionOrTrap(sessionCode);
    (session.broadcaster, session.startTime, session.endTime);
  };

  public shared ({ caller }) func updateScoreboard(sessionCode : Text, team1Score : Nat, team2Score : Nat, team1Icon : TeamIcon, team2Icon : TeamIcon) : async () {
    let session = getSessionOrTrap(sessionCode);

    if (session.endTime != null) {
      Runtime.trap("Cannot update scoreboard for a finished session");
    };

    let updatedScoreboard : Scoreboard = {
      team1Score;
      team2Score;
      team1Icon;
      team2Icon;
    };

    let updatedSession : Session = {
      broadcaster = session.broadcaster;
      startTime = session.startTime;
      endTime = session.endTime;
      events = session.events;
      scoreboard = updatedScoreboard;
      flagOverlays = session.flagOverlays;
    };
    sessions.add(sessionCode, updatedSession);
  };

  public query ({ caller }) func getScoreboard(sessionCode : Text) : async Scoreboard {
    let session = getSessionOrTrap(sessionCode);
    session.scoreboard;
  };

  public shared ({ caller }) func addFlagEvent(sessionCode : Text, team : Text, reason : Text) : async () {
    let session = getSessionOrTrap(sessionCode);

    if (session.endTime != null) {
      Runtime.trap("Cannot add events to a finished session");
    };

    let flagEvent : FlagEvent = {
      team;
      reason;
      timestamp = Time.now();
    };

    let newEvent : Event = {
      timestamp = flagEvent.timestamp;
      description = "Flag for " # team # ": " # reason;
      eventType = #flag;
      flagEvent = ?flagEvent;
    };

    session.events.add(newEvent);
    session.flagOverlays.add(flagEvent);
  };

  public query ({ caller }) func getActiveFlagOverlays(sessionCode : Text) : async [FlagEvent] {
    let session = getSessionOrTrap(sessionCode);
    session.flagOverlays.toArray();
  };

  public shared ({ caller }) func clearFlagOverlays(sessionCode : Text) : async () {
    let session = getSessionOrTrap(sessionCode);
    let updatedSession : Session = {
      broadcaster = session.broadcaster;
      startTime = session.startTime;
      endTime = session.endTime;
      events = session.events;
      scoreboard = session.scoreboard;
      flagOverlays = List.empty<FlagEvent>();
    };
    sessions.add(sessionCode, updatedSession);
  };
};
