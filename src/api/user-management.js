import request from '@/tools/request';

const isCscEnv = process.env.VUE_APP_DIST === 'CSC';

export const fetchRolesData = params => {
  return request({
    url: '/roles',
    method: 'GET',
    params: params,
  });
};

export const getRoleById = id => {
  return request({
    url: `/roles/${id}`,
    method: 'GET',
  });
};

export const createRole = data => {
  return request({
    url: '/roles',
    method: 'POST',
    data: data,
  });
};

export const modifyRoleById = (id, data) => {
  return request({
    url: `/roles/${id}`,
    method: 'PUT',
    data: data,
  });
};

export const deleteRole = id => {
  return request({
    url: `/roles/${id}`,
    method: 'DELETE',
  });
};

export const fetchUserData = params => {
  return request({
    url: '/users',
    method: 'GET',
    params: params,
    headers: {
      isEncrypt: isCscEnv,
    },
  });
};

export const searchUsers = params => {
  return request({
    url: 'user/search',
    params,
  });
};

export const createUser = data => {
  return request({
    url: `/users`,
    method: 'POST',
    data: data,
    headers: {
      isEncrypt: isCscEnv,
    },
  });
};

export const modifyUser = (id, data) => {
  return request({
    url: `/users/${id}`,
    method: 'PUT',
    data: data,
    headers: {
      isEncrypt: isCscEnv,
    },
  });
};

export const deleteUser = id => {
  return request({
    url: `/users/${id}`,
    method: 'DELETE',
  });
};

export const getUserById = id => {
  return request({
    url: `/users/${id}`,
    method: 'GET',
  });
};

export const createOAUser = data => {
  return request({
    url: `/users/oa`,
    method: 'POST',
    data: data,
    headers: {
      isEncrypt: isCscEnv,
    },
  });
};

export const getSubsystemUserRoles = () => {
  return request({
    url: `/system/permissions`,
    method: 'GET',
  });
};

export const changePassword = params => {
  return request({
    url: `/user/change-password`,
    method: 'PUT',
    data: params,
  });
};

// 获取所有部门
export const getDepartments = params => {
  return request({
    method: 'GET',
    url: `/departments`,
    params,
  });
};

// 获取部门信息
export const getDepartmentInfo = id => {
  return request({
    method: 'GET',
    url: `/departments/${id}`,
  });
};

// 获取部门下管理员
export const getDepartmentManager = (id, params) => {
  return request({
    method: 'GET',
    url: `/departments/${id}/dep-admins`,
    params,
  });
};

// 获取部门的所有用户
export const getDepartmentAllUser = (id, params) => {
  return request({
    method: 'GET',
    url: `/departments/${id}/users`,
    params, // paginate: 0不分页，1分页
  });
};

// 批量设置用户为部门管理员
export const setDepartmentManagers = (id, data) => {
  return request({
    method: 'POST',
    url: `/departments/${id}/dep-admins`,
    data,
  });
};

// 设置(dep_admin=true)/取消(dep_admin=false) 用户为部门管理员
export const deleteDepartmentManager = id => {
  return request({
    method: 'PUT',
    url: `/users/${id}/dep-admin`,
    data: { dep_admin: false },
  });
};

// 财通证券 -> 部门登录设置 ->获取部门
export const getDepartmentOfCtsec = () => {
  return request({
    method: 'GET',
    url: `/ctsec/departments`,
  });
};

// 财通证券 -> 部门登录设置 -> 设置部门
export const setDepartmentOfCtsec = (ids, checked = true) => {
  return request({
    method: 'PUT',
    url: `/ctsec/departments`,
    data: {
      ids,
      allow_login: checked,
    },
  });
};

// 海通 -> 获取二级部门
export const getSecondaryDepartments = params => {
  return request({
    method: 'GET',
    url: `/secondary/departments`,
    params,
  });
};

/**
 * 创建二级部门
 * @param {Number} data.parent_id 二级部门所属一级部门id
 * @param {String} data.department 二级部门名称
 * @returns
 */
export const addSecondaryDepartment = data => {
  return request({
    method: 'POST',
    url: `/secondary/departments`,
    data: Object.assign({}, data, {
      department_type: 1,
    }),
  });
};

// 编辑二级部门(名称/配置)
export const editSecondaryDepartment = data => {
  return request({
    method: 'PUT',
    url: `/secondary/departments`,
    data,
  });
};

// 删除二级部门
export const deleteSecondaryDepartment = id => {
  return request({
    method: 'DELETE',
    url: `/departments/${id}`,
  });
};

// 编辑二级部门人员
export const secondaryDepartmentUserManege = (id, data) => {
  return request({
    method: 'PUT',
    url: `/departments/${id}/users`,
    data,
  });
};

// 新增/修改用户手机号码
export const editUserPhoneNumber = (id, phone_number) => {
  return request({
    method: 'POST',
    url: `/users/${id}/phone_number`,
    data: {
      phone_number,
    },
  });
};

// 海通 -> 我的分享
export const getSharedRecord = params => {
  return request({
    method: 'GET',
    url: '/copy-records',
    params,
  });
};

// 海通 -> 异常用户
export const getAbnormalUser = params => {
  return request({
    method: 'GET',
    url: '/abnormal/users',
    params,
  });
};

// 长江证券 -> 获取业务部门
export const getBusinessDepartments = () => {
  return request({
    method: 'GET',
    url: '/cjsc/departments',
  });
};

// 长江证券 -> 获取业务类型
export const getBusinessTypes = () => {
  return request({
    method: 'GET',
    url: '/cjsc/project-types',
  });
};

// 招商银行 -> 获取业务系统列表
export const getBusinessSystems = name => {
  return request({
    method: 'GET',
    url: '/business-systems',
    params: {
      name,
    },
  });
};

export const fetchCustomerSys = () => {
  return request({
    url: '/customer/sys',
    method: 'GET',
  });
};
export const updateCustomerSys = data => {
  return request({
    url: '/customer/sys',
    method: 'POST',
    data: data,
  });
};

// 招商基金 -> 获取业务组列表
export const getCmfchinaBusinessSystems = params => {
  return request({
    method: 'GET',
    url: '/cmfchina/business-systems',
    params,
  });
};
