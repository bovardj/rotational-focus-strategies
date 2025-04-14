'use client'

// This function is used to convert a base64 string to a Uint8Array
// This is necessary for the VAPID key used in the web push notifications
// The VAPID key is a public key used to authenticate the push notifications

import { useEffect, useState } from "react"
import { sendNotification, subscribeUser, unsubscribeUser } from "@/app/lib/actions"

// This function is used to convert a base64 string to a Uint8Array
// This is necessary for the VAPID key used in the web push notifications
// The VAPID key is a public key used to authenticate the push notifications
// The VAPID key is generated using the web-push library
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
   
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
  
  export function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(
      null
    )
    const [message, setMessage] = useState('')
   
    useEffect(() => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setIsSupported(true)
        registerServiceWorker()
      }
    }, [])
   
    async function registerServiceWorker() {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    }
   
    async function subscribeToPush() {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      setSubscription(sub)
      const serializedSub = JSON.parse(JSON.stringify(sub))
      await subscribeUser(serializedSub)
    }
   
    async function unsubscribeFromPush() {
      await subscription?.unsubscribe()
      setSubscription(null)
      await unsubscribeUser()
    }
   
    async function sendTestNotification() {
      if (subscription) {
        await sendNotification(message)
        setMessage('')
      }
    }
   
    if (!isSupported) {
      return <p>Push notifications are not supported in this browser.</p>
    }
   
    return (
      <div>
        <h3>Push Notifications</h3>
        {subscription ? (
          <>
            <p className="text-sm text-gray-500 mb-2">You are subscribed to push notifications.</p>
            <button onClick={unsubscribeFromPush} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Unsubscribe from Push Notifications
                </button>
            <input
              type="text"
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendTestNotification} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Send Test
                </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">You are not subscribed to push notifications.</p>
            <button onClick={subscribeToPush} className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Subscribe to Push Notifications
            </button>
          </>
        )}
      </div>
    )
  }
  
  export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)
   
    useEffect(() => {
      setIsIOS(
        // eslint-disable-next-line
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      )
   
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])
   
    if (isStandalone) {
      return null // Don't show install button if already installed
    }
   
    return (
      <div>
        <h3>Install App</h3>
        <p className="text-sm text-gray-500 mb-2">This only works for iOS devices.</p>
        <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add to Home Screen
        </button>
        {isIOS && (
          <p>
            To install this app on your iOS device, tap the share button
            <span role="img" aria-label="share icon">
              {' '}
              ⎋{' '}
            </span>
            and then &quot;Add to Home Screen&quot;
            <span role="img" aria-label="plus icon">
              {' '}
              ➕{' '}
            </span>.
          </p>
        )}
      </div>
    )
  }
   