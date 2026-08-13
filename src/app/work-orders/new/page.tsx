'use client';

import React from 'react';
import { WorkOrderForm } from '@/components/WorkOrderForm';

export default function NewWorkOrderPage() {
  return (
    <div>
      <WorkOrderForm isEdit={false} />
    </div>
  );
}
