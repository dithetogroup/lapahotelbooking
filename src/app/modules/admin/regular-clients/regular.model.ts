export class RegularClients {
    id: number;
    rg_account: string;
    rg_title: string;
    rg_name: string;
    rg_surname: string;
    rg_company: string;
    rg_email: string;
    rg_company_phone: string;
    rg_company_person: string;
    rg_company_website: string;
    rg_isliable: string;
    rg_address: string;
    rg_phone: string;
    created_at: string;
    updated_at: string;
    rg_company_vat: string;
    rg_company_type: string;
  
    constructor(data: Partial<RegularClients> = {}) {
      this.id = data.id ?? 0;
      this.rg_account = data.rg_account ?? '';
      this.rg_title = data.rg_title ?? '';
      this.rg_company_phone = data.rg_company_phone ?? '';
      this.rg_company_website = data.rg_company_website ?? '';
      this.rg_company_person = data.rg_company_person ?? '';
      this.rg_name = data.rg_name ?? '';
      this.rg_surname = data.rg_surname ?? '';
      this.rg_company = data.rg_company ?? '';
      this.rg_email = data.rg_email ?? '';
      this.rg_address = data.rg_address ?? '';
      this.rg_isliable = data.rg_isliable ?? '';
      this.rg_phone = data.rg_phone ?? '';
      this.created_at = data.created_at ?? '';
      this.updated_at = data.updated_at ?? '';
      this.rg_company_vat = data.rg_company_vat ?? '';
      this.rg_company_type = data.rg_company_type ?? '';
    }
  }
  