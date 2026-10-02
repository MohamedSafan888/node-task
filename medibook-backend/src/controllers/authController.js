import User from '../models/User.js'

// @desc    Register a new user (Student or Instructor)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, bio, avatar } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email: email ? email.toLowerCase() : '' })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Student',
      bio,
      avatar
    })

    const token = user.generateAuthToken()

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      })
    }

    // Check for user (need password since it is set to select: false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const token = user.generateAuthToken()

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {}
    if (req.body.name) fieldsToUpdate.name = req.body.name
    if (req.body.bio !== undefined) fieldsToUpdate.bio = req.body.bio
    if (req.body.avatar) fieldsToUpdate.avatar = req.body.avatar

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    next(error)
  }
}
