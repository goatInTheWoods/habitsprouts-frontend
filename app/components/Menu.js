import React, { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import ConfirmationModal from './ConfirmationModal';
import axios from 'axios';
import { useUserInfo, useActions } from '../store';

function Menu({ isOpen, close }) {
  const { logout, openAlert } = useActions();
  const userInfo = useUserInfo();
  const menuItems = [
    { name: 'My Acount' },
    { name: 'Dark Mode' },
    { name: 'Share This App' },
    { name: 'Contact Us' },
  ];

  const myAccountSubMenu = [
    { name: 'Edit my info' },
    { name: 'Log out', onClick: handleLogOut },
    { name: 'Log out from all devices', onClick: handleLogOutAll },
    { name: 'Delete account', onClick: handleDeletingUserModal },
  ];

  const [isDeletingUserModalOpen, setIsDeletingUserModalOpen] =
    useState(false);

  function handleDeletingUserModal() {
    setIsDeletingUserModalOpen(!isDeletingUserModalOpen);
  }

  async function handleLogOut() {
    try {
      const response = await axios.post('/users/logout', userInfo);

      if (response.status === 204 || response.status === 200) {
        logout();
        openAlert({
          type: 'success',
          text: 'You have successfully logged out.',
        });
      }
    } catch (e) {
      alert('Something went wrong. Try again.');
    }
  }

  async function handleLogOutAll() {
    try {
      const response = await axios.post('/users/logoutAll', userInfo);
      if (response.status === 204 || response.status === 200) {
        logout();
        openAlert({
          type: 'success',
          text: 'You have successfully logged out from all devices.',
        });
      }
    } catch (e) {
      alert('Something went wrong. Try again.');
    }
  }

  async function handleDeletingUser() {
    try {
      const response = await axios.delete('/users/me');
      if (response.status === 200) {
        handleDeletingUserModal();
        logout();
        openAlert({
          type: 'success',
          text: 'Your account has been removed. See you next time!',
        });
      }
    } catch (e) {
      alert('Something went wrong. Try again.');
    }
  }

  return (
    <>
      {isDeletingUserModalOpen && (
        <ConfirmationModal
          isOpen={isDeletingUserModalOpen}
          close={handleDeletingUserModal}
          title="Delete Your Account"
          content={
            <>
              <p>Sorry to see you go😢 Before you proceed:</p>
              <ul>
                <li>
                  All of your personal information will be permanently
                  deleted.
                </li>
                <li>Your habit tracking data will be lost.</li>
                <li> This action is irreversible.</li>
              </ul>
              <p>Are you sure you want to delete your account?</p>
            </>
          }
          submitBtnTxt="Delete account"
          handleSubmit={handleDeletingUser}
        />
      )}
      <Offcanvas show={isOpen} onHide={close} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>HabitCount</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            {menuItems.map((item, index) => {
              if (index === 0) {
                return (
                  <ListGroup.Item
                    className="accordion accordion-flush p-0"
                    id="accordionFlushExample"
                    key={index}
                  >
                    <div className='"accordion-item"'>
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed ps-3 py-2 my-1"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#flush-collapseOne"
                          aria-expanded="false"
                          aria-controls="flush-collapseOne"
                        >
                          {item.name}
                        </button>
                      </h2>
                      <div
                        id="flush-collapseOne"
                        className="accordion-collapse collapse"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <ListGroup>
                          {myAccountSubMenu.map((item, index) => {
                            return (
                              <ListGroup.Item
                                className="ps-5"
                                key={index}
                                onClick={() => {
                                  if (item?.onClick) {
                                    item.onClick(); // Invoked the onClick function if it exists
                                  }
                                }}
                                action
                              >
                                {item?.name}
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              } else {
                return (
                  <ListGroup.Item key={index} action>
                    {item.name}
                  </ListGroup.Item>
                );
              }
            })}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Menu;
