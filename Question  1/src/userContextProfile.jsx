import { createContext, useContext, useReducer } from "react";
import { FaUserAlt } from "react-icons/fa";

const Auth = createContext({
  user: {
    username: "userID#007",
    nickname: "",
    bio: "",
  },
});

Auth.displayName = "Auth";

function useAuth() {
  return useContext(Auth);
}

const UserContext = createContext();
UserContext.displayName = "UserContext";

function reducer(state, action) {
  switch (action.type) {
    case "start update": {
      return {
        ...state,
        user: { ...state.user, ...action.updates },
        status: "pending",
        storedUser: state.user,
      };
    }
    case "finish update": {
      return {
        ...state,
        user: action.updatedUser,
        status: "resolved",
        storedUser: null,
        error: null,
      };
    }
    case "fail update": {
      return {
        ...state,
        status: "rejected",
        error: action.error,
        user: state.storedUser,
        storedUser: null,
      };
    }
    case "reset": {
      return {
        ...state,
        status: null,
        error: null,
      };
    }
    default: {
      console.log("No action called");
    }
  }
}

function UserProviderProfile({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    status: null,
    error: null,
    storedUser: user,
    user,
  });
  const value = [state, dispatch];
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUserProfile() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUserProfile must be used within a UserProviderProfile`);
  }
  return context;
}

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

async function updateUserProfile(user, updates) {
  await sleep(1500);
  if (
    `${updates.nickname} ${updates.bio}`.toLocaleLowerCase().includes("error")
  ) {
    return Promise.reject({
      message: "Something went wrong!\nDon't worry, this is a simulated error",
    });
  }
  if (Math.floor(Math.random() * 10) % 2 === 0) {
    return Promise.reject({
      message: "Something went wrong! please try again",
    });
  }
  return { ...user, ...updates };
}
export { UserProviderProfile, useUserProfile, updateUserProfile };