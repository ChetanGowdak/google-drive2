import React from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { auth } from "../../firebase";

const ProfileSection = ({ userPhoto, userName, handleAuth, showSearch, setShowSearch }) => {
  const email = auth?.currentUser?.email || "Not Available";

  return (
    <RightSection>
      <SignOut>
        <UserImg src={userPhoto} alt={userName} />
        <DropDown>
          <ProfileCard>
            <ProfileImageLarge>
              <img src={userPhoto} alt="Profile" />
            </ProfileImageLarge>

            <InfoRow>
              <AccountCircleOutlinedIcon />
              <span className="name">{userName}</span>
            </InfoRow>
            <InfoRow>
              <EmailOutlinedIcon />
              <span className="email">{email}</span>
            </InfoRow>

            <Divider />

            <SignOutButton onClick={handleAuth}>
              <LogoutOutlinedIcon />
              Sign Out
            </SignOutButton>
          </ProfileCard>
        </DropDown>
      </SignOut>
    </RightSection>
  );
};

export default ProfileSection;

// ✅ Styled Components
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const DropDown = styled.div`
  position: absolute;
  top: 55px;
  right: -40px;
  display: none;
  z-index: 1000;
`;

const SignOut = styled.div`
  position: relative;
  height: 45px;
  width: 45px;
  cursor: pointer;

  &:hover ${DropDown} {
    display: block;
  }
`;

const ProfileCard = styled.div`
  background: white;
  width: 260px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
  text-align: left;
  animation: fadeIn 0.2s ease-in-out;
`;

const ProfileImageLarge = styled.div`
  width: 70px;
  height: 70px;
  margin: 0 auto 10px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;

  svg {
    color: #5f6368;
  }

  .name {
    font-weight: 600;
    font-size: 14px;
  }

  .email {
    font-size: 12px;
    color: gray;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: #e0e0e0;
  margin: 10px 0;
`;

const SignOutButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #d93025;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #f1f1f1;
  }

  svg {
    color: #d93025;
  }
`;
