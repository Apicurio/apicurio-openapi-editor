/**
 * License data from choosealicense.com
 */

export interface LicenseMetaData {
    id: string;
    name: string;
    url: string;
    description?: string;
    permissions?: string[];
    conditions?: string[];
    limitations?: string[];
    featured?: boolean;
}

export const LICENSES: LicenseMetaData[] = [
    // Featured licenses with full details
    {
        id: "apache-2.0",
        name: "Apache License 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0",
        description: "A permissive license whose main conditions require preservation of copyright and license notices. Contributors provide an express grant of patent rights. Licensed works, modifications, and larger works may be distributed under different terms and without source code.",
        permissions: ["Commercial use", "Distribution", "Modification", "Patent use", "Private use"],
        conditions: ["License and copyright notice", "State changes"],
        limitations: ["Liability", "Trademark use", "Warranty"],
        featured: true
    },
    {
        id: "mit",
        name: "MIT License",
        url: "https://opensource.org/licenses/MIT",
        description: "A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.",
        permissions: ["Commercial use", "Distribution", "Modification", "Private use"],
        conditions: ["License and copyright notice"],
        limitations: ["Liability", "Warranty"],
        featured: true
    },
    {
        id: "gpl-3.0",
        name: "GNU GPLv3",
        url: "https://www.gnu.org/licenses/gpl-3.0.html",
        description: "Permissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.",
        permissions: ["Commercial use", "Distribution", "Modification", "Patent use", "Private use"],
        conditions: ["Disclose source", "License and copyright notice", "Same license", "State changes"],
        limitations: ["Liability", "Warranty"],
        featured: true
    },
    {
        id: "lgpl-3.0",
        name: "GNU LGPLv3",
        url: "https://www.gnu.org/licenses/lgpl-3.0.html",
        description: "Permissions of this copyleft license are conditioned on making available complete source code of licensed works and modifications under the same license or the GNU GPLv3. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. However, a larger work using the licensed work through interfaces provided by the licensed work may be distributed under different terms and without source code for the larger work.",
        permissions: ["Commercial use", "Distribution", "Modification", "Patent use", "Private use"],
        conditions: ["Disclose source", "License and copyright notice", "Same license (library)", "State changes"],
        limitations: ["Liability", "Warranty"],
        featured: true
    },
    {
        id: "agpl-3.0",
        name: "GNU AGPLv3",
        url: "https://www.gnu.org/licenses/agpl-3.0.html",
        description: "Permissions of this strongest copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. When a modified version is used to provide a service over a network, the complete source code of the modified version must be made available.",
        permissions: ["Commercial use", "Distribution", "Modification", "Patent use", "Private use"],
        conditions: ["Disclose source", "License and copyright notice", "Network use is distribution", "Same license", "State changes"],
        limitations: ["Liability", "Warranty"],
        featured: true
    },
    {
        id: "mpl-2.0",
        name: "Mozilla Public License 2.0",
        url: "https://www.mozilla.org/en-US/MPL/2.0/",
        description: "Permissions of this weak copyleft license are conditioned on making available source code of licensed files and modifications of those files under the same license (or in certain cases, one of the GNU licenses). Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. However, a larger work using the licensed work may be distributed under different terms and without source code for files added in the larger work.",
        permissions: ["Commercial use", "Distribution", "Modification", "Patent use", "Private use"],
        conditions: ["Disclose source", "License and copyright notice", "Same license (file)"],
        limitations: ["Liability", "Trademark use", "Warranty"],
        featured: true
    },
    {
        id: "unlicense",
        name: "The Unlicense",
        url: "https://unlicense.org/",
        description: "A license with no conditions whatsoever which dedicates works to the public domain. Unlicensed works, modifications, and larger works may be distributed under different terms and without source code.",
        permissions: ["Commercial use", "Distribution", "Modification", "Private use"],
        conditions: [],
        limitations: ["Liability", "Warranty"],
        featured: true
    }
];

/**
 * Find license by ID
 */
export function findLicenseById(id: string): LicenseMetaData | undefined {
    return LICENSES.find(l => l.id.toLowerCase() === id.toLowerCase());
}

/**
 * Find license by name (fuzzy match)
 */
export function findLicenseByName(name: string): LicenseMetaData | undefined {
    if (!name) return undefined;

    const nameLower = name.toLowerCase().trim();

    // Try exact match first
    let license = LICENSES.find(l => l.name.toLowerCase() === nameLower);
    if (license) return license;

    // Try partial match
    license = LICENSES.find(l => l.name.toLowerCase().includes(nameLower) || nameLower.includes(l.name.toLowerCase()));
    if (license) return license;

    // Try matching common abbreviations
    const abbreviations: { [key: string]: string } = {
        'mit': 'mit',
        'apache': 'apache-2.0',
        'apache 2': 'apache-2.0',
        'apache 2.0': 'apache-2.0',
        'gpl': 'gpl-3.0',
        'gpl v3': 'gpl-3.0',
        'gpl-3': 'gpl-3.0',
        'lgpl': 'lgpl-3.0',
        'bsd': 'bsd-3-clause',
        'mpl': 'mpl-2.0',
        'agpl': 'agpl-3.0'
    };

    const abbreviation = abbreviations[nameLower];
    if (abbreviation) {
        return LICENSES.find(l => l.id === abbreviation);
    }

    return undefined;
}

/**
 * Get featured licenses
 */
export function getFeaturedLicenses(): LicenseMetaData[] {
    return LICENSES.filter(l => l.featured);
}
