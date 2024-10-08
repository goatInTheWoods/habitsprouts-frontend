import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Button from 'react-bootstrap/Button';
import Menu from './Menu';
import { ReactComponent as Bars } from '../../images/bars.svg';
import { ReactComponent as User } from '../../images/user.svg';
import { useUserInfo } from '../../store/store';
import styled from 'styled-components';

function HeaderLoggedIn() {
  const userInfo = useUserInfo();
  const [hasError, setHasError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  // function handleSearchIcon(e) {
  //   e.preventDefault();
  //   appDispatch({ type: 'openSearch' });
  // }

  // function handleChat() {
  //   appDispatch({ type: 'toggleChat' });
  // }

  const renderProfileImage = () => {
    if (hasError || userInfo.avatar == null) {
      return <UserIcon />;
    }
    return (
      <ProfileImage
        src={userInfo!.avatar}
        alt="Profile Image"
        onError={() => setHasError(true)}
      />
    );
  };

  return (
    <>
      {isMenuOpen && <Menu isOpen={isMenuOpen} close={closeMenu} />}
      <div className="d-flex flex-row my-3 my-md-0 gap-3">
        <StyledLink
          data-for="profile"
          data-tip={userInfo.username}
          to={`/profile/${userInfo.username}`}
          className="mr-2 pe-none"
          aria-disabled="true"
        >
          {renderProfileImage()}
        </StyledLink>
        <ReactTooltip
          place="bottom"
          id="profile"
          className="custom-tooltip"
        />
        <Button onClick={openMenu} className="bg-white">
          <Bars />
        </Button>
      </div>
    </>
  );
}

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 50%;
`;

const UserIcon = styled(User)`
  width: 100%;
  height: 100%;
  transform: translate(12px, 10px) scale(1.2);
`;

export default HeaderLoggedIn;
