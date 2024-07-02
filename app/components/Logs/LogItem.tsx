import React from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { formatLogDate } from '@/utils/dateUtil';
import ItemDropdown from '@/components/common/ItemDropdown';
import { useActions } from '@/store/store';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { axiosDeleteLog } from '@/services/LogService';
import { Log } from '@/types/log';

interface LogItem {
  log: Log;
  editSelectedItem?: (id: string) => void;
}

const LogItem = ({ log, editSelectedItem }: LogItem) => {
  const { openConfirm, closeConfirm, openAlert } = useActions();
  const queryClient = useQueryClient();

  const date = new Date(log.date);
  const habitStatus = `${log.habit?.currentCount} ${log.habit?.unit} | ${log.habit?.title}`;

  const deleteLogMutation = useMutation({
    mutationFn: axiosDeleteLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
    onError: error => {
      console.error('Error deleting log:', error);
    },
  });

  async function handleDelete(id: string) {
    await deleteLogMutation.mutate(id);
    closeConfirm();
  }

  function handleDeleteConfirm(id: string) {
    openConfirm({
      title: 'Delete Your Log',
      content: `
            <p>Are you sure you want to delete this log?</p>
        `,
      submitBtnText: 'Delete this log',
      submitFn: () => handleDelete(id),
    });
  }
  interface SafeHtmlContentProps {
    htmlContent: string;
  }

  const SafeHtmlContent = ({ htmlContent }: SafeHtmlContentProps) => {
    const sanitizedContent = DOMPurify.sanitize(htmlContent);

    return (
      <HtmlContents
        className="px-1 text-color-blackGrey"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  };

  return (
    <Container className="d-flex flex-column px-3 pt-3 w-100 position-relative">
      <div className="mb-1 d-flex justify-content-between align-items-center w-100">
        <LogDate>{formatLogDate(date)}</LogDate>
        <StatusText className="px-2 ms-1 me-3 text-color-greenGrey bg-lightGreen fst-italic fw-lighter">
          {habitStatus}
        </StatusText>
        <ItemDropdown
          onEditClick={() => {
            editSelectedItem && editSelectedItem(log.id);
          }}
          onDeleteClick={() => {
            handleDeleteConfirm(log.id);
          }}
        />
      </div>

      <SafeHtmlContent htmlContent={log.content} />
    </Container>
  );
};

const Container = styled.div`
  border-radius: 26px;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.04);

  .dropdown-toggle::after {
    display: none;
  }
`;

const LogDate = styled.span`
  color: #799183;
  flex-shrink: 0;
`;

const StatusText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const HtmlContents = styled.div`
  p {
    margin-bottom: 0.3rem;
    &:last-child {
      margin-bottom: 1rem;
    }
  }

  ul > li > p {
    margin-bottom: 0.3rem !important;
  }
`;

export default LogItem;
