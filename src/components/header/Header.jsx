import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, provider } from "../../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserName,
  selectUserPhoto,
  setSignOutState,
  setUserLoginDetails,
} from "../../store/UserSlice";
import { selectSidebarBool, setSidebarBool } from "../../store/BoolSlice";
import { useNavigate } from "react-router-dom";
import LogoWrapperComponent from "./LogoWrapper";
import SearchBar from "./SearchBar";
import LeftIcons from "./LeftIcons";
import ProfileSection from "./ProfileSection";
import { SearchIcons } from "../common/SvgIcons";

const Header = () => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userPhoto = useSelector(selectUserPhoto);
  const sidebarBool = useSelector(selectSidebarBool);
  const navigate = useNavigate();

  // ✅ Dark Mode state + persistence
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        navigate("/home");
      }
    });
  }, [userName]);

  const handleAuth = async () => {
    if (!userName) {
      try {
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      try {
        await signOut(auth);
        dispatch(setSignOutState());
        navigate("/");
      } catch (error) {
        console.log("Error signing out: ", error.message);
      }
    }
  };

  const setUser = (user) => {
    dispatch(
      setUserLoginDetails({
        name: user.displayName,
        photo: user.photoURL,
      })
    );
  };

  return (
    <Container>
      <Wrapper>
        <LogoWrapperComponent
          onClick={() => dispatch(setSidebarBool(!sidebarBool))}
          userName={userName}
        />

        {userName && (
  <div className="search-desktop" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
    <div style={{ width: "100%", maxWidth: "650px", background: "transparent" }}>
      <SearchBar />
    </div>
  </div>
)}




        {/* ✅ Tablet/Mobile Compact Search */}
        {userName && (
          <div className="search-mobile">
            <CompactSearch
              onSearch={(query) => navigate(`/search/${query}`)}
            />
          </div>
        )}

        {/* ✅ RIGHT */}
        <RightContainer>
          {/* 🌙 Desktop Toggle in LeftIcons */}
          <LeftIcons isDark={isDark} toggleTheme={toggleTheme} />

          {/* 🌙 Mobile Toggle */}
          <MobileThemeToggle onClick={toggleTheme}>
            {isDark ? "☀️" : "🌙"}
          </MobileThemeToggle>

          <ProfileSection
            userPhoto={userPhoto}
            userName={userName}
            handleAuth={handleAuth}
          />
        </RightContainer>
      </Wrapper>
    </Container>
  );
};

/* ✅ Compact Search Component */
const CompactSearch = ({ onSearch }) => {
  const [q, setQ] = useState("");

  return (
    <CompactSearchBox>
      <input
        type="text"
        placeholder="Search..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && q.trim() && onSearch(q)}
      />
      <button onClick={() => q.trim() && onSearch(q)}>
        <SearchIcons />
      </button>
    </CompactSearchBox>
  );
};

export default Header;

/* ========= STYLES ========= */

const Container = styled.div.attrs(() => ({ className: "header-bar" }))`
  position: sticky;
  width: 100%;
  top: 0;
  z-index: 999;
  background-color: var(--bg);
  border-bottom: 1px solid var(--border);
  box-shadow: none;
  padding: 6px 0;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;

  .search-desktop {
    flex: 1;
    display: flex;
    justify-content: center;
    @media screen and (max-width: 1024px) {
      display: none;
    }
  }

  .search-mobile {
    display: none;
    flex: 1;
    justify-content: center;
    @media screen and (max-width: 1024px) {
      display: flex;
    }
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CompactSearchBox = styled.div`
  display: flex;
  align-items: center;
  background: transparent !important; /* ✅ Remove container box */
  border: none !important;
  box-shadow: none !important;
  width: 100%;
  max-width: 400px;

  input {
    width: 100%;
    padding: 8px 36px 8px 12px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    border-radius: 6px;
    outline: none;
    font-size: 14px;
  }

  input:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.25);
  }

  input::placeholder {
    color: #9ca3af;
  }

  button {
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    pointer-events: auto;
  }

  svg {
    font-size: 18px;
    color: var(--text);
    opacity: 0.6;
  }

  @media screen and (max-width: 1024px) {
    display: flex;
    position: relative;
  }
`;



const MobileThemeToggle = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-right: 8px;
    padding: 6px;
    border-radius: 50%;
    transition: transform .15s ease;
    &:active { transform: scale(.94); }
  }
`;
