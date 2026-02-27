import { Request, Response, NextFunction } from 'express';
import Package from '../models/Package';

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
export const getPackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { destination, difficulty, isFeatured, isAvailable, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

    const query: Record<string, unknown> = {};
    if (destination) query.destination = destination;
    if (difficulty) query.difficulty = difficulty;
    if (isFeatured) query.isFeatured = isFeatured === 'true';
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, unknown>).$gte = Number(minPrice);
      if (maxPrice) (query.price as Record<string, unknown>).$lte = Number(maxPrice);
    }
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Package.countDocuments(query);
    const packages = await Package.find(query)
      .populate('destination', 'name country coverImage')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: packages.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: packages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
export const getPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pkg = await Package.findById(req.params.id).populate('destination', 'name country coverImage climate bestTimeToVisit');
    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found' });
      return;
    }
    res.status(200).json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
};

// @desc    Create package
// @route   POST /api/packages
// @access  Admin
export const createPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, message: 'Package created', data: pkg });
  } catch (error) {
    next(error);
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Admin
export const updatePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Package updated', data: pkg });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Admin
export const deletePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Package deleted' });
  } catch (error) {
    next(error);
  }
};