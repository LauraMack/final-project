import React, { useContext } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "./Context/CurrentUserContext";
import { UsersContext } from "./Context/UsersContext";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";
const Signup = () => {
  const {
    setCurrentUser,
    setSignedIn,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
  } = useContext(CurrentUserContext);

  const { setCurrentLatitude, setCurrentLongitude } = useContext(UsersContext);

  let history = useHistory();

  const handleEmail = (ev) => {
    setEmail(ev.target.value);
    setError("");
  };

  const handlePassword = (ev) => {
    setPassword(ev.target.value);
    setError("");
  };

  const handleRegularSignUp = (ev) => {
    ev.preventDefault();
    const newId = uuidv4();
    fetch(`/users`, {
      method: "POST",
      body: JSON.stringify({
        _id: newId,
        name: "",
        avatar: "",
        bio: "",
        forte: [],
        rating: [],
        ads: [],
        reviews: [],
        messages: [],
        email,
        password,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          setCurrentUser(data);
          setSignedIn(true);
          setCurrentLatitude(null);
          setCurrentLongitude(null);
          setError("");
          window.sessionStorage.setItem("currentUser", JSON.stringify(data));
          history.push(`/edit-profile/${data.data._id}`);
        }
        if (data.message === "email already in use") {
          setError(`Oops! ${email} is already in use. Please sign in.`);
        }
      });
  };

  return (
    <Wrapper>
      <Div>
        <SignUpDiv>
          <Title>Sign Up for Fetch</Title>
          <form onSubmit={handleRegularSignUp}>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@email.com"
              onChange={handleEmail}
              required
            ></Input>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="password"
              onChange={handlePassword}
              required
            ></Input>
            <Button>Sign up</Button>
          </form>
          <Member>
            Already a member?{" "}
            <SignInButton
              onClick={() => {
                setError("");
                history.push("/signin");
              }}
            >
              Sign in
            </SignInButton>
          </Member>
          {error !== "" && <ErrorMessage>{error}</ErrorMessage>}
        </SignUpDiv>
      </Div>
    </Wrapper>
  );
};

export default Signup;

const Wrapper = styled.div`
  background-color: #e1eedd;
  height: max-content;
  width: 100vw;
`;

const Div = styled.div`
  background-color: #e1eedd;
  height: 350px;
  width: 500px;
  margin: 0 auto;
  margin-top: 100px;
  border-radius: 20px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
`;

const SignUpDiv = styled.div`
  height: 400px;
  width: 300px;
  margin: 0 auto;
  display: flex;
  position: relative;
  top: 30px;
  flex-direction: column;
`;

const Input = styled.input`
  font-family: "Montserrat";
  padding: 5px;
  width: 300px;
  border-radius: 4px;
  border: solid 1px #183a1d;
  background-color: #faf9f0;
  &::placeholder {
    color: #183a1d;
  }
  &:focus {
    outline: none;
    border: solid 2px #40916c;
  }
`;

const Title = styled.p`
  width: 300px;
  text-align: center;
  font-size: 24px;
  color: #183a1d;
`;

const Label = styled.p`
  margin: 0;
  font-size: 12px;
  margin-top: 10px;
  color: #183a1d;
`;

const Button = styled.button`
  font-family: "Montserrat";
  width: 312px;
  margin-top: 10px;
  border-radius: 4px;
  border: solid 1px #183a1d;
  padding: 5px;
  background-color: #40916c;
  color: white;
  font-weight: bold;
  &:hover {
    background-color: #f6c453;
    color: #183a1d;
  }
`;
const Member = styled.p`
  font-size: 12px;
  width: 300px;
  text-align: center;
  margin-top: 20px;
  color: #183a1d;
`;

const SignInButton = styled.button`
  font-size: 12px;
  width: 55px;
  text-align: center;
  border-style: none;
  background-color: transparent;
  color: #40916c;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  width: 300px;
  text-align: center;
  margin: 0;
`;
