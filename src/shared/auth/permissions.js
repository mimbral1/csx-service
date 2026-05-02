const rolePermissions = {
  CSX_ADMIN: ['*'],

  CSX_MANAGER: [
    'csx:claim:read',
    'csx:claim:write',
    'csx:claim:assign',
    'csx:claim:scale',
    'csx:claim:transition',
    'csx:claim:change-type',
    'csx:claim-items:read',
    'csx:claim-items:write',
    'csx:claim-file:read',
    'csx:claim-file:write',
    'csx:claim-compensation:read',
    'csx:claim-compensation:assign',
    'csx:claim-management:read',
    'csx:claim-management:write',
    'csx:claim-config:read',
    'csx:sla:read'
  ],

  CSX_SAC: [
    'csx:claim:read',
    'csx:claim:write',
    'csx:claim:transition',
    'csx:claim-items:read',
    'csx:claim-items:write',
    'csx:claim-file:read',
    'csx:claim-file:write',
    'csx:claim-management:read',
    'csx:claim-management:write',
    'csx:claim-config:read'
  ],

  CSX_STORE: [
    'csx:claim:read',
    'csx:claim:write',
    'csx:claim-items:write',
    'csx:claim-file:write',
    'csx:claim-config:read'
  ],

  CSX_WAREHOUSE: [
    'csx:claim:read',
    'csx:claim-items:read',
    'csx:claim-items:write',
    'csx:claim-management:write',
    'csx:claim-config:read'
  ],

  CSX_DELIVERY: [
    'csx:claim:read',
    'csx:claim-management:write',
    'csx:claim:transition',
    'csx:claim-config:read'
  ],

  CSX_FINANCE: [
    'csx:claim:read',
    'csx:claim-compensation:read',
    'csx:claim-compensation:assign',
    'csx:claim-config:read'
  ],

  CSX_READONLY: [
    'csx:claim:read',
    'csx:claim-items:read',
    'csx:claim-file:read',
    'csx:claim-management:read',
    'csx:claim-config:read',
    'csx:sla:read'
  ]
};

function hasPermission(role, permission) {
  const permissions = rolePermissions[role] || [];
  return permissions.includes('*') || permissions.includes(permission);
}

module.exports = {
  rolePermissions,
  hasPermission
};
