import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RequestQueueProvider, useRequestQueue } from '@/context/RequestQueueContext';

describe('RequestQueueContext', () => {
  it('provides initial pendingCount of 0', () => {
    const TestComponent = () => {
      const { pendingCount } = useRequestQueue();
      return <div>Count: {pendingCount}</div>;
    };

    render(
      <RequestQueueProvider>
        <TestComponent />
      </RequestQueueProvider>
    );

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('provides initial requestIds as empty Set', () => {
    const TestComponent = () => {
      const { requestIds } = useRequestQueue();
      return <div>Size: {requestIds.size}</div>;
    };

    render(
      <RequestQueueProvider>
        <TestComponent />
      </RequestQueueProvider>
    );

    expect(screen.getByText('Size: 0')).toBeInTheDocument();
  });

  it('adds request ID to requestIds when addRequest is called', () => {
    const TestComponent = () => {
      const { requestIds, addRequest } = useRequestQueue();
      return (
        <div>
          <div>Size: {requestIds.size}</div>
          <div>Has test-id: {requestIds.has('test-id') ? 'yes' : 'no'}</div>
          <button onClick={() => addRequest('test-id')}>Add</button>
        </div>
      );
    };

    render(
      <RequestQueueProvider>
        <TestComponent />
      </RequestQueueProvider>
    );

    const button = screen.getByText('Add');
    act(() => {
      button.click();
    });

    expect(screen.getByText('Size: 1')).toBeInTheDocument();
    expect(screen.getByText('Has test-id: yes')).toBeInTheDocument();
  });

  it('removes request ID from requestIds when removeRequest is called', () => {
    const TestComponent = () => {
      const { requestIds, addRequest, removeRequest } = useRequestQueue();
      return (
        <div>
          <div>Size: {requestIds.size}</div>
          <div>Has test-id: {requestIds.has('test-id') ? 'yes' : 'no'}</div>
          <button onClick={() => addRequest('test-id')}>Add</button>
          <button onClick={() => removeRequest('test-id')}>Remove</button>
        </div>
      );
    };

    render(
      <RequestQueueProvider>
        <TestComponent />
      </RequestQueueProvider>
    );

    const addButton = screen.getByText('Add');
    const removeButton = screen.getByText('Remove');

    act(() => {
      addButton.click();
    });

    expect(screen.getByText('Size: 1')).toBeInTheDocument();
    expect(screen.getByText('Has test-id: yes')).toBeInTheDocument();

    act(() => {
      removeButton.click();
    });

    expect(screen.getByText('Size: 0')).toBeInTheDocument();
    expect(screen.getByText('Has test-id: no')).toBeInTheDocument();
  });

  it('updates pendingCount based on requestIds size', () => {
    const TestComponent = () => {
      const { pendingCount, addRequest, removeRequest } = useRequestQueue();
      return (
        <div>
          <div>Count: {pendingCount}</div>
          <button onClick={() => addRequest('id-1')}>Add 1</button>
          <button onClick={() => addRequest('id-2')}>Add 2</button>
          <button onClick={() => removeRequest('id-1')}>Remove 1</button>
        </div>
      );
    };

    render(
      <RequestQueueProvider>
        <TestComponent />
      </RequestQueueProvider>
    );

    const addButton1 = screen.getByText('Add 1');
    const addButton2 = screen.getByText('Add 2');
    const removeButton = screen.getByText('Remove 1');

    act(() => {
      addButton1.click();
      addButton2.click();
    });

    expect(screen.getByText('Count: 2')).toBeInTheDocument();

    act(() => {
      removeButton.click();
    });

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('clears all requests when clearRequests is called', () => {
    const TestComponent = () => {
      const { requestIds, pendingCount, addRequest, clearRequests } = useRequestQueue();
      return (
        <div>
          <div>Count: {pendingCount}</div>
          <div>Size: {requestIds.size}</div>
          <button onClick={() => addRequest('id-1')}>Add 1</button>
          <button onClick={() => addRequest('id-2')}>Add 2</button>
          <button onClick={clearRequests}>Clear</button>
        </div>
      );
    };

    render(
      <RequestQueueProvider>
        <TestComponent />
      </RequestQueueProvider>
    );

    const addButton1 = screen.getByText('Add 1');
    const addButton2 = screen.getByText('Add 2');
    const clearButton = screen.getByText('Clear');

    act(() => {
      addButton1.click();
      addButton2.click();
    });

    expect(screen.getByText('Count: 2')).toBeInTheDocument();
    expect(screen.getByText('Size: 2')).toBeInTheDocument();

    act(() => {
      clearButton.click();
    });

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByText('Size: 0')).toBeInTheDocument();
  });

  it('throws error when useRequestQueue is used outside provider', () => {
    const TestComponent = () => {
      const { pendingCount } = useRequestQueue();
      return <div>Count: {pendingCount}</div>;
    };

    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useRequestQueue must be used within a RequestQueueProvider');

    console.error = consoleError;
  });
});
