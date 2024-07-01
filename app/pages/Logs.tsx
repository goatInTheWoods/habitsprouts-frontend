import React, { useState, useEffect } from 'react';
import Page from '@/components/common/Page';
import LogFilter from '@/components/Logs/LogFilter';
import Button from 'react-bootstrap/Button';
import LogModal from '@/components/Logs/LogModal';
import LogItem from '@/components/Logs/LogItem';
import Spinner from 'react-bootstrap/Spinner';
import { axiosFetchHabitList } from '@/services/HabitService';
import { axiosFetchLogs } from '@/services/LogService';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { useLoggedIn, useUserInfo } from '@/store/store';
import { useLocation } from 'react-router-dom';
import NudgeMessage from '@/components/Logs/NudgeMessage';
import { Log, HabitDetail } from '@/types/log';

const Logs = () => {
  const loggedIn = useLoggedIn();
  const userInfo = useUserInfo();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [filterList, setFilterList] = useState<HabitDetail[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [allowedToFetch, setAllowedToFetch] = useState(false);

  const {
    isLoading: isLoadingHabitList,
    isError: isErrorHabitList,
    data: habitList,
  } = useQuery({
    queryKey: ['habitList'],
    queryFn: axiosFetchHabitList,
    enabled: allowedToFetch,
  });

  const {
    isLoading: isLoadingLogs,
    isFetching: isFetchingLogs,
    isError: isErrorLogs,
    data: logs,
    error: logsError,
  } = useQuery({
    queryKey: ['logs'],
    queryFn: axiosFetchLogs,
    enabled: allowedToFetch,
  });

  function openLogModal() {
    setIsCreateModalOpen(true);
  }

  function closeLogModal() {
    setIsCreateModalOpen(false);
    setSelectedLog(null);
  }

  function editSelectedItem(id: string) {
    const target = logs.find((log: Log) => {
      return log.id === id;
    });
    setSelectedLog(target);
    openLogModal();
  }

  function filterLogs(logs: Log[]) {
    if (!filter) return setFilteredLogs(logs); // Ensure there is a filter set
    const filteredLogs = logs.filter(
      (log: Log) => log.habit.id === filter
    );
    setFilteredLogs(filteredLogs);
  }

  function handleFilterList(logs: Log[]) {
    const checkDuplicates = new Set();
    const uniqueHabits = logs
      .filter((log: Log) => {
        const habitId = log.habit.id;
        if (checkDuplicates.has(habitId)) {
          return false;
        } else {
          checkDuplicates.add(habitId);
          return true;
        }
      })
      .map((log: Log) => log.habit);

    setFilterList(uniqueHabits);
  }

  useEffect(() => {
    if (loggedIn && userInfo.token) {
      setAllowedToFetch(true);
    } else {
      setFilterList([]);
      setFilteredLogs([]);
    }
  }, [loggedIn, userInfo.token]);

  useEffect(() => {
    if (logs) {
      filterLogs(logs);
      handleFilterList(logs);
    }
  }, [logs, filter]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialFilter = queryParams.get('filter');
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, []);

  return (
    <Page title="Logs" className="d-flex flex-column">
      {isCreateModalOpen && (
        <LogModal
          isOpen={isCreateModalOpen}
          closeModal={closeLogModal}
          habitList={habitList}
          selectedLog={selectedLog}
        />
      )}
      <UpperContainer className="mb-3 hstack gap-3">
        <LogFilter
          habitList={filterList}
          filter={filter}
          setFilter={setFilter}
        />

        {loggedIn && (
          <Button
            onClick={openLogModal}
            className="ms-auto px-3 text-light"
            variant="primary"
          >
            New Log
          </Button>
        )}
      </UpperContainer>
      <LogContainer className="vstack gap-3 no-scrollbar">
        {isLoadingLogs && (
          <div className="d-flex justify-content-center">
            <Spinner
              animation="border"
              variant="primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {!loggedIn && <NudgeMessage />}
        {filteredLogs &&
          filteredLogs.map(log => {
            return (
              <div key={log.id}>
                <LogItem
                  log={log}
                  isFetching={isFetchingLogs}
                  editSelectedItem={editSelectedItem}
                />
              </div>
            );
          })}
      </LogContainer>
    </Page>
  );
};

const UpperContainer = styled.div`
  margin-bottom: 1rem;
  text-align: right;
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fbfbfb;
`;

const LogContainer = styled.div`
  max-height: calc(100vh - 22vh);
  padding-bottom: 22vh;
  overflow-y: auto;
  overflow-anchor: none;
`;

export default Logs;
