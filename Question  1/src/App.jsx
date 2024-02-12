import "./Styles.css";
import { useState } from "react";
import { dequal } from "dequal";
import { UserProviderProfile, useUserProfile, updateUserProfile,
} from "./userContextProfile";

import { AvatarGenerator } from "random-avatar-generator";

const generator = new AvatarGenerator();
const UserForm = () => {
  const [{ user, status, error }, userDispatch] = useUserProfile();
  const isPending = status === "pending";
  const isRejected = status === "rejected";
  const [formState, setFormState] = useState(user);
  const isChanged = !dequal(user, formState);

  function handleChange(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    userDispatch({ type: "start update", updates: formState });
    updateUserProfile(user, formState).then(
      (updatedUser) => userDispatch({ type: "finish update", updatedUser }),
      (error) => userDispatch({ type: "fail update", error })
    );
  }

  return (
    <form onSubmit={handleSubmit}>
    <h3>User Interface</h3>
      <div>

        <div >
          <input  id="formControlDisabled" type="text"
            placeholder="user#1234" aria-label="disabled input example"
            disabled
          />
        </div>

        <div>
          <div>
            <input placeholder="Please enter your Nickname"
              value={formState.nickname}
              onChange={handleChange} name="nickname"
              type="text" id="nickName"
            />

            <label>
              {formState.nickname ? "" : ""}
            </label>

          </div>
        </div>
      </div>

      <div>
        <input
          type="text" id="bio"
          name="bio" value={formState.bio} onChange={handleChange}
          className="form-control" placeholder="Tell us more about you..."
        />
        <label>
          {formState.bio ? "" :""}
        </label>
      </div>

      {isRejected ? (
        <span style={{ color: "red" }}>{error.message}</span>
      ) : null}


      <br/><div className="buttons-container">
        <button type="submit" disabled={(!isChanged && !isRejected) || isPending}
         >
          {isPending ? "..." : isRejected
            ? "✖ Try again" : isChanged ? "Submit" : "Submitted"}
        </button>

        <button
          type="button"
          onClick={() => {
            setFormState(user);
            userDispatch({ type: "reset" });
          }}
          disabled={!isChanged || isPending}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

function UserResults() {
  const [{ user }] = useUserProfile();

  return (
    <div className="res">

      <div className="ava">
        {!user.nickname ? (
          user.avatar
        ) : (
          <img
            style={{ width: "100px" }}
            src={generator.generateRandomAvatar(user.nickname)}
            alt="avatar"
          />
        )}
      </div>

      <div className="i">
        <h4 style={{ textTransform: "capitalize",margin:"0" }}>
          {user.nickname ? (
            user.nickname
          ) : (
            <span>
              ------------
            </span>
          )}
        </h4>

        <span>
          {user.bio ? (
            user.bio
          ) : (
            <span style={{ color: "white", fontStyle: "italic" }}>
              -----------------
            </span>
          )}
        </span>
        <em>[user#1234]</em>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="main">
      <UserProviderProfile>
        <UserForm />
        <UserResults />
      </UserProviderProfile>
    </div>
  );
}

export default App;
