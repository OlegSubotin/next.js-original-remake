'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Define the form schema using Zod for validation
const FormSchema = z.object({
  id: z.string(),
  sellerId: z.string({
    invalid_type_error: 'Please select a seller.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['awaiting', 'fulfilled'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// Define specific schemas for creating and updating invoices
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Define a state type for managing errors and messages
export type State = {
  errors?: {
    sellerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

/**
 * Creates a new invoice based on the provided form data.
 * @param {State} prevState - The previous state containing errors and messages.
 * @param {FormData} formData - The form data submitted for creating an invoice.
 * @returns {Promise<State>} A promise that resolves to the updated state after attempting to create an invoice.
 */
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateInvoice.safeParse({
    sellerId: formData.get('sellerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { sellerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (seller_id, amount, status, date)
      VALUES (${sellerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * Updates an existing invoice based on the provided form data.
 * @param {string} id - The ID of the invoice to be updated.
 * @param {State} prevState - The previous state containing errors and messages.
 * @param {FormData} formData - The form data submitted for updating an invoice.
 * @returns {Promise<State>} A promise that resolves to the updated state after attempting to update an invoice.
 */
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    sellerId: formData.get('sellerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { sellerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET seller_id = ${sellerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

/**
 * Deletes an invoice from the database.
 * @param {string} id - The ID of the invoice to be deleted.
 * @returns {Promise<State>} A promise that resolves to the updated state after attempting to delete an invoice.
 */
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice.',
    };
  }
}

/**
 * Authenticates a user using the provided form data.
 * @param {string | undefined} prevState - The previous state containing information about the authentication attempt.
 * @param {FormData} formData - The form data submitted for authentication.
 * @returns {Promise<string>} A promise that resolves to an error message if authentication fails.
 */
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
