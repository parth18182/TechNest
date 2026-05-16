import React from 'react'
import { Link } from 'react-router-dom'
import {FaFacebook,FaInstagram,FaTwitterSquare,FaPinterest} from 'react-icons/fa'

function Footer() {
    return (
        <footer className='bg-gray-900 text-gray-200 py-10'>
            <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
                {/* info */}
                <div className='mb-6 md:mb-0'>
                    <Link to='/'>
                        <img src="/ekart.png" alt="" className='w-32' />
                    </Link>
                    <p className='mt-2 text-sm'>Powering Your World with the best in Electronics.</p>
                    <p className='mt-2 text-sm'>123 Electronics st, style city, NY 10001.</p>
                    <p className='text-sm'>Email: support@zaptro.com</p>
                    <p className='text-sm'>Phone: +91165214231 </p>
                </div>
                {/* customer service link */}

                <div className='mb-6 md:mb-0'>
                    <h3 className='text-xl font-semibold'>customer service</h3>
                    <ul className='mt-2 text-sm space-y-2'>
                        <li>Contact Us</li>
                        <li>Shipping & Returns</li>
                        <li>FAQs</li>
                        <li>Order Tracking</li>
                        <li>Size Guide</li>
                    </ul>
                </div>

                {/* social media links */}

                <div className='mb-6 md:mb-0'>
                    <h3 className='text-xl font-semibold'>Follow Us</h3>
                    <div className='flex gap-2 text-xl mt-2'>
                        <FaFacebook/>
                        <FaInstagram/>
                        <FaTwitterSquare/>
                        <FaPinterest/>
                    </div>
                </div>
                {/* newletter subscription */}

                <div>
                    <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
                    <p className='mt-2 text-sm'>Subscibe to get special offers, free giveaways and more</p>
                    <form action="" className='mt-4 flex'>
                        <input type="email" 
                        placeholder='Your email address'

                        className='w-full bg-white text-gray-800 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500'
                        />
                        <button type='submit' className='bg-pink-600 text-white px-4 rounded-r-md hover:bg-red-700'>
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
            <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
                <p>&copy; {new Date().getFullYear()}
                    <span className='text-pink-600'> EKart </span>
                    All rights resereved
                </p>
            </div>  
        </footer>
    )
}

export default Footer