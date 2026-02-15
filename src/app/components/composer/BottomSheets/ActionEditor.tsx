import { useState, useEffect } from 'react';

interface ActionEditorProps {
  initialData: {
    actionType?: 'approve' | 'reject' | 'request_approval' | 'notify';
    label?: string;
    description?: string;
    message?: string;
    recipient?: string;
  };
  onValueChange: (data: any) => void;
}

export default function ActionEditor({ initialData, onValueChange }: ActionEditorProps) {
  const [actionType, setActionType] = useState(initialData.actionType || 'approve');
  const [label, setLabel] = useState(initialData.label || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [message, setMessage] = useState(initialData.message || '');
  const [recipient, setRecipient] = useState(initialData.recipient || '');

  useEffect(() => {
    onValueChange({
      actionType,
      label,
      description,
      message,
      recipient
    });
  }, [actionType, label, description, message, recipient]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Action Type
        </label>
        <select
          value={actionType}
          onChange={(e) => setActionType(e.target.value as any)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="approve">Auto-approve</option>
          <option value="reject">Auto-reject</option>
          <option value="request_approval">Request Manual Approval</option>
          <option value="notify">Send Notification</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Action Label
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Approve Transaction"
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe what this action does..."
          rows={3}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {(actionType === 'notify' || actionType === 'request_approval') && (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Recipient
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="e.g., manager@company.com or #approvals-channel"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {actionType !== 'approve' && (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {actionType === 'reject' ? 'Rejection Message' : 'Message Template'}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              actionType === 'reject'
                ? 'Transaction rejected due to policy violation...'
                : 'Transaction requires approval for {amount} at {merchant}...'
            }
            rows={4}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use placeholders like {'{amount}'}, {'{merchant}'}, {'{category}'}
          </p>
        </div>
      )}
    </div>
  );
}
