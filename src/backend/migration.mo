import Map "mo:core/Map";
import List "mo:core/List";

module {
  type OldActor = {
    sessions : Map.Map<Text, OldSession>;
  };

  type OldSession = {
    broadcaster : Text;
    startTime : Int;
    endTime : ?Int;
    events : List.List<OldEvent>;
    scoreboard : Scoreboard;
  };

  type Scoreboard = {
    team1Score : Nat;
    team2Score : Nat;
    team1Icon : TeamIcon;
    team2Icon : TeamIcon;
  };

  type TeamIcon = {
    #dolphin;
    #bullfrog;
    #fist;
    #tornado;
  };

  type OldEvent = {
    timestamp : Int;
    description : Text;
    eventType : OldEventType;
  };

  type OldEventType = {
    #flag;
    #point;
  };

  type NewActor = {
    sessions : Map.Map<Text, NewSession>;
  };

  type NewSession = {
    broadcaster : Text;
    startTime : Int;
    endTime : ?Int;
    events : List.List<NewEvent>;
    scoreboard : Scoreboard;
    flagOverlays : List.List<FlagEvent>;
  };

  type NewEvent = {
    timestamp : Int;
    description : Text;
    eventType : NewEventType;
    flagEvent : ?FlagEvent;
  };

  type FlagEvent = {
    team : Text;
    reason : Text;
    timestamp : Int;
  };

  type NewEventType = {
    #flag;
    #point;
  };

  public func run(old : OldActor) : NewActor {
    let newSessions = old.sessions.map<Text, OldSession, NewSession>(
      func(_sessionCode, oldSession) {
        {
          oldSession with
          events = oldSession.events.map<OldEvent, NewEvent>(
            func(oldEvent) {
              {
                oldEvent with
                flagEvent = null;
              };
            }
          );
          flagOverlays = List.empty<FlagEvent>();
        };
      }
    );
    { sessions = newSessions };
  };
};
