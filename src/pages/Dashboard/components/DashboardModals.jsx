import React from 'react';
import LeadForm from "../../../components/forms/LeadForm";
import AccountForm from "../../../components/forms/AccountForm";
import OpportunityForm from "../../../components/forms/OpportunityForm";
import TaskForm from "../../../components/forms/TaskForm";
import NoteForm from "../../../components/forms/NoteForm";
import RecordDetailsModal from "../../../components/modals/RecordDetailsModal";

// API Imports
import { createLead, updateLead } from "../../../api/leads";
import { createAccount, updateAccount } from "../../../api/accounts";
import { createOpportunity, updateOpportunity } from "../../../api/opportunities";
import { createTask, updateTask } from "../../../api/tasks";
import { createNote } from "../../../api/notes";

const DashboardModals = ({
    mode,
    isModalOpen,
    editingRecord,
    onClose,
    onSuccess,
    selectedRecord,
    onDetailClose
}) => {

    const renderFormModal = () => {
        if (!isModalOpen) return null;

        const props = {
            onClose,
            onSuccess,
            initialData: editingRecord
        };

        if (mode === "leads") return <LeadForm {...props} createApi={createLead} updateApi={updateLead} />;
        if (mode === "accounts") return <AccountForm {...props} createApi={createAccount} updateApi={updateAccount} />;
        if (mode === "opportunities") return <OpportunityForm {...props} createApi={createOpportunity} updateApi={updateOpportunity} />;
        if (mode === "tasks") return <TaskForm {...props} createApi={createTask} updateApi={updateTask} />;
        if (mode === "notes") return <NoteForm {...props} createApi={createNote} />;
        return null;
    };

    return (
        <>
            {renderFormModal()}
            {selectedRecord && (
                <RecordDetailsModal
                    record={selectedRecord}
                    type={mode}
                    onClose={onDetailClose}
                />
            )}
        </>
    );
};

export default DashboardModals;
