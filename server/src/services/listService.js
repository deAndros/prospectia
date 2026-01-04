import List from '#models/listModel.js';
import Lead from '#models/leadModel.js';

const baseLeadFilter = { isDeleted: { $ne: true } };

export const createList = async (payload) => {
  const { name, prospects = [], country, niche, scoreMin, scoreMax, createdBy } = payload;

  if (!name) {
    throw new Error('name is required');
  }

  const list = await List.create({
    name,
    prospects,
    status: 'Active',
    createdBy,
    filter: {
      country,
      niche,
      scoreMin,
      scoreMax,
    },
  });

  return list;
};

export const getLists = async () => {
  return List.find({ status: 'Active' }).sort({ createdAt: -1 }).lean();
};

export const getListById = async (id) => {
  return List.findOne({ _id: id, status: 'Active' }).lean();
};

export const updateList = async (id, payload) => {
  const list = await List.findById(id);
  if (!list || list.status === 'Inactive') {
    throw new Error('List not found');
  }

  if (payload.name) {
    list.name = payload.name;
  }

  if (payload.prospects) {
    list.prospects = payload.prospects;
  }

  if (payload.filter) {
    list.filter = { ...list.filter, ...payload.filter };
  }

  await list.save();
  return list;
};

export const deleteList = async (id) => {
  const list = await List.findByIdAndUpdate(
    id,
    { status: 'Inactive' },
    { new: true }
  );
  if (!list) {
    throw new Error('List not found');
  }
  return list;
};

export const getListOptions = async () => {
  const leads = await Lead.find(baseLeadFilter).select('country niche').lean();
  const countries = new Set();
  const niches = new Set();

  for (const lead of leads) {
    if (lead.country) countries.add(lead.country);
    if (lead.niche) niches.add(lead.niche);
  }

  return {
    countries: Array.from(countries).sort(),
    niches: Array.from(niches).sort(),
  };
};

export default {
  createList,
  getLists,
  getListById,
  updateList,
  deleteList,
  getListOptions,
};

