import React, { useState, useEffect } from 'react';
import Page from '@/components/common/Page';
import LogFilter from '@/components/Logs/LogFilter';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import LogModal from '@/components/Logs/LogModal';
import DatePickerInput from '@/components/Logs/DatePickerInput';
import LogItem from '@/components/Logs/LogItem';
import { axiosFetchHabitList } from '@/services/HabitService';
import { axiosFetchLogs } from '@/services/LogService';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

const LogList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [filterList, setFilterList] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedLog, setSelctedLog] = useState(null);

  const {
    isLoading: isLoadingHabitList,
    isError: isErrorHabitList,
    isSuccess: isSuccessHabitList,
    data: habitList,
    error: habitListError,
  } = useQuery({
    queryKey: ['habitList'],
    queryFn: axiosFetchHabitList,
  });

  const {
    isLoading: isLoadingLogs,
    isFetching: isFetchigLogs,
    isError: isErrorLogs,
    isSuccess: isSuccessLogs,
    data: logs,
    error: logsError,
  } = useQuery({
    queryKey: ['logs'],
    queryFn: axiosFetchLogs,
  });

  function openLogModal() {
    setIsCreateModalOpen(true);
  }

  function closeLogModal() {
    setIsCreateModalOpen(false);
    setSelctedLog(null);
  }

  function editSelectedItem(id) {
    const target = logs.find(log => {
      return log.id === id;
    });
    setSelctedLog(target);
    openLogModal();
  }

  function filterLogs(logs) {
    const filteredLogsById = logs.filter(log =>
      filter ? log.habit.habitId === filter : true
    );
    setFilteredLogs(filteredLogsById);
  }

  function handleFilterList(logs) {
    const checkDuplicates = new Set();
    const extractedHabits = logs
      .filter(log => {
        const habitId = log.habit.habitId;
        if (checkDuplicates.has(habitId)) {
          return false;
        } else {
          checkDuplicates.add(habitId);
          return true;
        }
      })
      .map(log => log.habit);
    setFilterList(extractedHabits);
  }

  useEffect(() => {
    if (logs) {
      filterLogs(logs);
      handleFilterList(logs);
    }
  }, [logs, filter]);

  return (
    <Page title="LogList" className="d-flex flex-column">
      {isCreateModalOpen && (
        <LogModal
          isOpen={isCreateModalOpen}
          closeModal={closeLogModal}
          habitList={habitList}
          selectedLog={selectedLog}
        />
      )}
      <UpperContainer className="mb-3 hstack gap-3">
        <LogFilter habitList={filterList} setFilter={setFilter} />
        <Button
          onClick={openLogModal}
          className="ms-auto px-3 text-light"
          variant="primary"
        >
          New Log
        </Button>
      </UpperContainer>
      <LogContainer className="vstack gap-3">
        {filteredLogs &&
          filteredLogs.map(log => {
            return (
              <div key={log.id}>
                <LogItem
                  log={log}
                  isFetching={isFetchigLogs}
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
  overflow-y: scroll;
  overflow-anchor: none;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  &::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }
`;

export default LogList;
