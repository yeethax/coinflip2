import React, { useState, useRef, useEffect } from 'react';
import { BaseEmoji, PickerProps, Data } from 'emoji-mart';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Menu, Transition } from '@headlessui/react'

interface Props {
  data?: Data;
  disabled?: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onEmojiSelect?: (emoji: BaseEmoji) => void;
  ref?: React.MutableRefObject<HTMLInputElement>;
}

export default function EmojiPicker({ value, setValue, disabled, ...other }: Props) {
  return (
    <Menu as="div" className="relative">
      <div className='flex justify-between items-center'>
        <Menu.Button className="inline-flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="white">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
          </svg>
        </Menu.Button>
      </div>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute -left-4 bottom-14 mt-2 w-56 rounded-md shadow-lg bg-transparent ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              <Picker data={data} onEmojiSelect={(emoji: BaseEmoji) => { setValue(value + emoji?.native); }} />
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

