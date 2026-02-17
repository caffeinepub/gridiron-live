import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  type TeamIcon = {
    #dolphin;
    #bullfrog;
    #fist;
    #tornado;
  };

  type TeamRole = {
    #offense;
    #defense;
    #none;
  };

  type Scoreboard = {
    team1Score : Nat;
    team2Score : Nat;
    team1Icon : TeamIcon;
    team2Icon : TeamIcon;
    team1Role : TeamRole;
    team2Role : TeamRole;
  };

  type EventType = {
    #flag;
    #point;
  };

  type Caption = {
    text : Text;
    timestamp : Time.Time;
    sessionCode : Text;
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

  type NewSession = {
    broadcaster : Text;
    startTime : Time.Time;
    endTime : ?Time.Time;
    events : List.List<Event>;
    scoreboard : Scoreboard;
    teamIconsChosen : Bool;
    captions : List.List<Caption>;
  };

  type OldSession = {
    broadcaster : Text;
    startTime : Time.Time;
    endTime : ?Time.Time;
    events : List.List<Event>;
    scoreboard : Scoreboard;
    teamIconsChosen : Bool;
  };

  type OldActor = {
    sessions : Map.Map<Text, OldSession>;
  };

  type NewActor = {
    sessions : Map.Map<Text, NewSession>;
  };

  public func run(old : OldActor) : NewActor {
    let newSessions = old.sessions.map<Text, OldSession, NewSession>(
      func(_sessionCode, oldSession) {
        {
          oldSession with
          captions = List.empty<Caption>()
        };
      }
    );
    { sessions = newSessions };
  };
};
