import { faker } from '@faker-js/faker';
import { Logger } from './logger';

/**
 * Test Data Generator utility
 * Provides methods to generate various types of test data
 */
export class TestDataGenerator {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('TestDataGenerator');
  }

  /**
   * Generate user registration data
   */
  generateUserData() {
    const userData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number('###-###-####'),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      dateOfBirth: faker.date.past({ years: 25 }).toISOString().split('T')[0],
      password: faker.internet.password({ length: 12, pattern: /[A-Za-z0-9!@#$%^&*]/ }),
      confirmPassword: '',
      username: faker.internet.userName(),
    };

    userData.confirmPassword = userData.password;
    
    this.logger.logTestData(userData);
    return userData;
  }

  /**
   * Generate form data for various forms
   */
  generateFormData(formType: 'contact' | 'feedback' | 'survey' | 'application') {
    const baseData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number('###-###-####'),
    };

    switch (formType) {
      case 'contact':
        return {
          ...baseData,
          subject: faker.lorem.sentence(3),
          message: faker.lorem.paragraph(2),
          category: faker.helpers.arrayElement(['General', 'Support', 'Sales', 'Technical']),
        };

      case 'feedback':
        return {
          ...baseData,
          rating: faker.number.int({ min: 1, max: 5 }),
          feedback: faker.lorem.paragraph(1),
          recommend: faker.datatype.boolean(),
        };

      case 'survey':
        return {
          ...baseData,
          age: faker.number.int({ min: 18, max: 65 }),
          occupation: faker.person.jobTitle(),
          interests: faker.helpers.arrayElements(['Technology', 'Sports', 'Music', 'Travel', 'Food'], { min: 1, max: 3 }),
          comments: faker.lorem.paragraph(1),
        };

      case 'application':
        return {
          ...baseData,
          experience: faker.number.int({ min: 0, max: 20 }),
          education: faker.helpers.arrayElement(['High School', 'Bachelor', 'Master', 'PhD']),
          skills: faker.helpers.arrayElements(['JavaScript', 'Python', 'Java', 'React', 'Node.js'], { min: 2, max: 4 }),
          coverLetter: faker.lorem.paragraph(3),
        };

      default:
        return baseData;
    }
  }

  /**
   * Generate product data
   */
  generateProductData() {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      category: faker.commerce.department(),
      brand: faker.company.name(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      inStock: faker.datatype.boolean(),
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
      reviews: faker.number.int({ min: 0, max: 100 }),
    };
  }

  /**
   * Generate order data
   */
  generateOrderData() {
    return {
      orderNumber: faker.string.alphanumeric(10).toUpperCase(),
      customerName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('###-###-####'),
      shippingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      billingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
      items: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
        name: faker.commerce.productName(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      })),
      paymentMethod: faker.helpers.arrayElement(['Credit Card', 'PayPal', 'Bank Transfer']),
      orderDate: faker.date.recent({ days: 30 }),
    };
  }

  /**
   * Generate random text data
   */
  generateTextData(type: 'paragraph' | 'sentence' | 'word' | 'title', count: number = 1) {
    switch (type) {
      case 'paragraph':
        return faker.lorem.paragraphs(count);
      case 'sentence':
        return faker.lorem.sentences(count);
      case 'word':
        return faker.lorem.words(count);
      case 'title':
        return faker.lorem.sentence(3);
      default:
        return faker.lorem.text();
    }
  }

  /**
   * Generate file data for upload tests
   */
  generateFileData() {
    return {
      fileName: faker.system.fileName(),
      filePath: faker.system.filePath(),
      fileSize: faker.number.int({ min: 1024, max: 10485760 }), // 1KB to 10MB
      mimeType: faker.helpers.arrayElement([
        'image/jpeg',
        'image/png',
        'application/pdf',
        'text/plain',
        'application/msword'
      ]),
    };
  }

  /**
   * Generate date data
   */
  generateDateData() {
    return {
      past: faker.date.past(),
      future: faker.date.future(),
      recent: faker.date.recent(),
      soon: faker.date.soon(),
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    };
  }

  /**
   * Generate location data
   */
  generateLocationData() {
    return {
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
      coordinates: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
    };
  }

  /**
   * Generate company data
   */
  generateCompanyData() {
    return {
      name: faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
      bs: faker.company.buzzPhrase(),
      industry: faker.company.buzzNoun(),
      founded: faker.date.past({ years: 50 }),
      employees: faker.number.int({ min: 10, max: 10000 }),
      revenue: faker.number.int({ min: 1000000, max: 1000000000 }),
    };
  }

  /**
   * Generate random number within range
   */
  generateNumber(min: number, max: number, decimals: number = 0) {
    if (decimals === 0) {
      return faker.number.int({ min, max });
    }
    return faker.number.float({ min, max, fractionDigits: decimals });
  }

  /**
   * Generate random boolean
   */
  generateBoolean() {
    return faker.datatype.boolean();
  }

  /**
   * Generate random array element
   */
  generateArrayElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }

  /**
   * Generate random array elements
   */
  generateArrayElements<T>(array: T[], min: number = 1, max?: number): T[] {
    return faker.helpers.arrayElements(array, { min, max });
  }
} 